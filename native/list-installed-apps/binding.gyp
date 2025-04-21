{
  "targets": [
    {
      "target_name": "list-installed-apps",
      "sources": [
        "src/appinfo.cc",
        "src/module.cc"
      ],
      "include_dirs": [
        "<!@(node -p \"require('node-addon-api').include\")",
        "include/"
      ],
      "dependencies": [
        "<!(node -p \"require('node-addon-api').gyp\")"
      ],
      "defines": [
        "NODE_ADDON_API_CPP_EXCEPTIONS",
        "NAPI_DISABLE_CPP_EXCEPTIONS"
      ],
      "conditions": [
        ['OS=="win"', {
          "libraries": [
            "-ladvapi32",
            "-lshell32",
            "-lmsi"
          ],
        }, {
          "libraries": [
          ],
        }],
      ],
      "cflags!": [
        "-fno-exceptions"
      ],
      "cflags_cc!": [
        "-fno-exceptions"
      ],
      "xcode_settings": {
        "GCC_ENABLE_CPP_EXCEPTIONS": "YES",
        "CLANG_CXX_LIBRARY": "libc++",
        "MACOSX_DEPLOYMENT_TARGET": "10.14"
      },
      "msvs_settings": {
        "VCCLCompilerTool": {
          "ExceptionHandling": 1
        }
      }
    }
  ]
}
