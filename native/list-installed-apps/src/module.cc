#include <napi.h>
#include <vector>
#include <string>
#ifdef _WIN32
#include <windows.h>
#endif

#include "../include/appinfo.h"

Napi::Array GetInstalledAppsWrapped(const Napi::CallbackInfo &info)
{
  Napi::Env env = info.Env();
  std::vector<AppInfoModule::AppInfo> apps = AppInfoModule::GetInstalledApps();

  Napi::Array result = Napi::Array::New(env);

  for (size_t i = 0; i < apps.size(); i++)
  {
    Napi::Object obj = Napi::Object::New(env);

    obj.Set("productName", Napi::String::New(env, apps[i].productName));
    obj.Set("executablePath", Napi::String::New(env, apps[i].executablePath));
    result[i++] = obj;
  }

  return result;
}

Napi::Object Init(Napi::Env env, Napi::Object exports)
{
  exports.Set("getInstalledApps", Napi::Function::New(env, GetInstalledAppsWrapped));
  return exports;
}

NODE_API_MODULE(appinfo, Init);
