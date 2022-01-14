import execa from "execa";
import { detectPackageManager } from ".";

export interface InstallPackageOptions {
  cwd?: string; //子进程的当前工作目录
  dev?: boolean; // 是否是开发依赖
  silent?: boolean; //标准输出
  packageManager?: string; // 包管理器
  preferOffline?: boolean; // 优先使用缓存数据
  additionalArgs?: string[]; // 附加参数
}

export async function installPackage(
  names: string | string[],
  options: InstallPackageOptions = {}
) {
  // 获取本地包管理工具默认是npm
  const agent =
    options.packageManager ||
    (await detectPackageManager(options.cwd)) ||
    "npm";

  if (!Array.isArray(names)) names = [names]; // 如果names不是数组则转成数组

  const args = options.additionalArgs || []; // 附件参数

  if (options.preferOffline) args.unshift("--prefer-offline"); // 是否使用缓存

  // pnpm install -D --prefer-offline vite

  return execa(
    agent,
    [
      agent === "yarn" ? "add" : "install",
      options.dev ? "-D" : "",
      ...args, // 附件参数
      ...names, // 需要安装的包名
    ].filter(Boolean),
    {
      stdio: options.silent ? "ignore" : "inherit", // 输出格式
      cwd: options.cwd, //当前工作目录
    }
  );
}
