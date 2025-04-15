#include <windows.h>
#include <windef.h>
#include <msi.h>
#include <shellapi.h>
#include <string>
#include <vector>
#include "../include/appinfo.h"

namespace AppInfoModule
{
  std::vector<AppInfo> GetInstalledApps()
  {
    std::vector<AppInfo> apps;
    const wchar_t *uninstallPaths[] = {L"SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall",
                                       L"SOFTWARE\\Wow6432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall"};

    // Check registry entries
    for (const auto &path : uninstallPaths)
    {
      HKEY hKey;
      if (RegOpenKeyExW(HKEY_LOCAL_MACHINE, path, 0, KEY_READ, &hKey) == ERROR_SUCCESS)
      {
        DWORD subkeyIndex = 0;
        wchar_t subkeyName[255];
        DWORD subkeyNameSize = sizeof(subkeyName) / sizeof(wchar_t);

        while (RegEnumKeyExW(hKey, subkeyIndex++, subkeyName, &subkeyNameSize, NULL, NULL, NULL, NULL) == ERROR_SUCCESS)
        {
          HKEY hSubKey;
          if (RegOpenKeyExW(hKey, subkeyName, 0, KEY_READ, &hSubKey) == ERROR_SUCCESS)
          {
            AppInfo info;
            wchar_t displayName[255];
            DWORD size = sizeof(displayName);

            // Get product name
            if (RegGetValueW(hSubKey, NULL, L"DisplayName", RRF_RT_REG_SZ, NULL, displayName, &size) == ERROR_SUCCESS)
            {
              info.productName = displayName;
            }

            // Get executable path from icon path or uninstall string
            wchar_t iconPath[MAX_PATH];
            size = sizeof(iconPath);
            if (RegGetValueW(hSubKey, NULL, L"DisplayIcon", RRF_RT_REG_SZ, NULL, iconPath, &size) == ERROR_SUCCESS)
            {
              info.executablePath = iconPath;
            }
            else
            {
              wchar_t uninstallPath[MAX_PATH];
              size = sizeof(uninstallPath);
              if (RegGetValueW(hSubKey, NULL, L"UninstallString", RRF_RT_REG_SZ, NULL, uninstallPath, &size) == ERROR_SUCCESS)
              {
                info.executablePath = uninstallPath;
              }
            }

            // Extract icon
            if (!info.executablePath.empty())
            {
              HICON hIcon;
              ExtractIconExW(info.executablePath.c_str(), 0, &hIcon, NULL, 1);
              info.appIcon = hIcon;
            }

            // Add to list if valid
            if (!info.productName.empty() && !info.executablePath.empty())
            {
              apps.push_back(info);
            }
            RegCloseKey(hSubKey);
          }
          subkeyNameSize = sizeof(subkeyName) / sizeof(wchar_t);
        }
        RegCloseKey(hKey);
      }
    }

    // Check MSI-installed applications
    DWORD index = 0;
    wchar_t productCode[39];
    while (MsiEnumProductsExW(nullptr, nullptr, MSIINSTALLCONTEXT_ALL, index++, productCode, nullptr, nullptr, nullptr) == ERROR_SUCCESS)
    {
      wchar_t productName[255];
      DWORD size = sizeof(productName);
      if (MsiGetProductInfoExW(productCode, nullptr, MSIINSTALLCONTEXT_ALL, L"InstalledProductName", productName, &size) == ERROR_SUCCESS)
      {
        AppInfo info;
        info.productName = productName;

        // Get executable path from MSI package
        wchar_t installPath[MAX_PATH];
        size = sizeof(installPath);
        if (MsiGetProductInfoExW(productCode, nullptr, MSIINSTALLCONTEXT_ALL, L"InstallSource", installPath, &size) == ERROR_SUCCESS)
        {
          info.executablePath = installPath;

          // Extract icon
          HICON hIcon;
          ExtractIconExW(info.executablePath.c_str(), 0, &hIcon, NULL, 1);
          info.appIcon = hIcon;

          apps.push_back(info);
        }
      }
    }

    return apps;
  }
}
