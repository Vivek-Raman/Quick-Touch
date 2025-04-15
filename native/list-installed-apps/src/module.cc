#include <napi.h>
#include <vector>
#include <windows.h>
#include <string>
#include "../include/appinfo.h"

// Helper function to convert wstring to UTF-8 string
std::string wstring_to_utf8(const std::wstring &wstr)
{
  if (wstr.empty())
    return std::string();
  int size_needed = WideCharToMultiByte(CP_UTF8, 0, wstr.c_str(), (int)wstr.size(), nullptr, 0, nullptr, nullptr);
  std::string str(size_needed, 0);
  WideCharToMultiByte(CP_UTF8, 0, wstr.c_str(), (int)wstr.size(), &str[0], size_needed, nullptr, nullptr);
  return str;
}

Napi::Array GetInstalledAppsWrapped(const Napi::CallbackInfo &info)
{
  Napi::Env env = info.Env();
  std::vector<AppInfoModule::AppInfo> apps = AppInfoModule::GetInstalledApps();

  Napi::Array result = Napi::Array::New(env);

  for (size_t i = 0; i < apps.size(); i++)
  {
    Napi::Object obj = Napi::Object::New(env);

    // Convert wide strings to UTF-8
    std::string productName = wstring_to_utf8(apps[i].productName);
    std::string executablePath = wstring_to_utf8(apps[i].executablePath);

    obj.Set("productName", Napi::String::New(env, productName));
    obj.Set("executablePath", Napi::String::New(env, executablePath));

    // Convert HICON to Buffer
    if (apps[i].appIcon)
    {
      ICONINFO iconInfo;
      if (GetIconInfo(apps[i].appIcon, &iconInfo))
      {
        BITMAP bmp;
        if (GetObject(iconInfo.hbmColor, sizeof(BITMAP), &bmp))
        {
          // Create buffer and copy icon data
          size_t bufferSize = bmp.bmWidthBytes * bmp.bmHeight;
          if (bufferSize > 0)
          {
            Napi::Buffer<uint8_t> iconBuffer = Napi::Buffer<uint8_t>::New(env, bufferSize);
            if (GetBitmapBits(iconInfo.hbmColor, bufferSize, iconBuffer.Data()))
            {
              obj.Set("icon", iconBuffer);
            }
          }
        }
        // Clean up GDI objects
        DeleteObject(iconInfo.hbmColor);
        DeleteObject(iconInfo.hbmMask);
      }
      DestroyIcon(apps[i].appIcon);
    }

    result[i] = obj;
  }

  return result;
}

Napi::Object Init(Napi::Env env, Napi::Object exports)
{
  exports.Set("getInstalledApps", Napi::Function::New(env, GetInstalledAppsWrapped));
  return exports;
}

NODE_API_MODULE(appinfo, Init);
