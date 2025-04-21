#pragma once
#include <string>
#include <vector>

namespace AppInfoModule
{
  struct AppInfo
  {
    std::string productName;
    std::string executablePath;
  };

  std::vector<AppInfo> GetInstalledApps();
}
