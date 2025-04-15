#pragma once
#include <vector>

namespace AppInfoModule
{
  struct AppInfo
  {
    std::wstring productName;
    std::wstring executablePath;
    HICON appIcon;
  };

  std::vector<AppInfo> GetInstalledApps();
}
