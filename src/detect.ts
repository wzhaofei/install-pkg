import path from "path";
import findUp from "find-up"; // 通过遍历父目录查找文件或目录

export type PackageManager = "pnpm" | "yarn" | "npm"; // 定义包管理工具类型

// lock文件与锁文件的对应关系
const LOCKS: Record<string, PackageManager> = {
  "pnpm-lock.yaml": "pnpm",
  "yarn.lock": "yarn",
  "package-lock.json": "npm",
};

// 根据lock文件寻找包管理工具
export async function detectPackageManager(cwd = process.cwd()) {
  const result = await findUp(Object.keys(LOCKS), { cwd }); // 在工作目录中寻找 lock 文件
  // path.basename 返回路径中的最后一部分  pnpm-lock.yaml
  const agent = result ? LOCKS[path.basename(result)] : null; // 有则返回对应的包管理工具没有则返回空
  return agent;
}
