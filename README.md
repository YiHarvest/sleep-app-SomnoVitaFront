# SomnoVita 睡眠健康管理小程序

一个基于 uni-app Vue3 开发的睡眠健康管理微信小程序，集成 Django 后端 API。

## 项目结构

```
SomnoVitaFront/
├── pages/                  # 页面文件
│   ├── index/             # 首页（监测页面）
│   ├── monitor/           # 监测页面
│   ├── report/            # 报告页面
│   ├── cbti/              # CBTI治疗页面
│   ├── analysis/          # AI分析页面
│   └── profile/           # 我的页面
├── static/                # 静态资源
│   └── *.png             # 导航栏图标
├── utils/                 # 工具函数
│   ├── api.js            # API接口封装
│   └── utils.js          # 通用工具函数
├── config/                # 配置文件
│   └── config.js         # 应用配置
├── reference/             # 参考代码（Vue2版本）
├── pages.json            # 页面配置
├── manifest.json         # 应用配置
└── App.uvue              # 应用入口
```

## 功能特性

### 已实现功能

1. **底部导航栏**
   - 5个主要页面：监测、报告、CBTI、AI分析、我的
   - 自定义图标和样式

2. **我的页面**
   - 用户信息展示
   - 睡眠数据统计
   - 设备管理（扫码绑定、解绑）
   - 微信手机号登录
   - 功能菜单导航

3. **API集成准备**
   - 完整的API接口封装
   - 请求拦截器和错误处理
   - Token自动管理
   - 环境配置管理

### 待实现功能

1. **监测页面**
   - 实时睡眠数据展示
   - 设备连接状态
   - 开始/停止监测

2. **报告页面**
   - 睡眠质量图表
   - 历史报告列表
   - 详细分析数据

3. **CBTI页面**
   - 治疗模块列表
   - 课程进度跟踪
   - 互动练习

4. **AI分析页面**
   - 个性化建议
   - 智能分析结果
   - AI助手对话

## API接口说明

### 基础配置

在 `config/config.js` 中配置后端地址：

```javascript
const API_CONFIG = {
  development: {
    BASE_URL: 'http://localhost:8000/api',  // 开发环境
  },
  production: {
    BASE_URL: 'https://your-domain.com/api', // 生产环境
  }
}
```

### 接口分类

#### 1. 用户认证 (`api.auth`)
- `loginWithPhone(phoneData)` - 手机号登录
- `getUserInfo()` - 获取用户信息
- `updateUserInfo(userInfo)` - 更新用户信息

#### 2. 设备管理 (`api.device`)
- `bindDevice(deviceData)` - 绑定设备
- `getDeviceList()` - 获取设备列表
- `unbindDevice(deviceId)` - 解绑设备
- `getDeviceDetail(deviceId)` - 获取设备详情

#### 3. 睡眠数据 (`api.sleep`)
- `getSleepData(params)` - 获取睡眠数据
- `getSleepReport(params)` - 获取睡眠报告
- `getSleepStats()` - 获取睡眠统计

#### 4. CBTI治疗 (`api.cbti`)
- `getCourseList()` - 获取课程列表
- `getCourseDetail(courseId)` - 获取课程详情
- `submitProgress(progressData)` - 提交课程进度

#### 5. AI分析 (`api.ai`)
- `getAnalysis(params)` - 获取AI分析结果
- `getSuggestions()` - 获取AI建议

### 使用示例

```javascript
import { api } from '@/utils/api.js'

// 获取用户信息
try {
  const userInfo = await api.auth.getUserInfo()
  console.log('用户信息:', userInfo)
} catch (error) {
  console.error('获取失败:', error)
}

// 绑定设备
try {
  const result = await api.device.bindDevice({
    device_code: 'DEVICE_CODE_FROM_QR'
  })
  console.log('绑定成功:', result)
} catch (error) {
  console.error('绑定失败:', error)
}
```

## Django后端接口要求

### 1. 认证接口

```python
# POST /api/auth/login-phone/
{
  "encrypted_data": "微信加密数据",
  "iv": "微信IV",
  "code": "微信登录code"
}

# 返回
{
  "token": "JWT_TOKEN",
  "user_info": {
    "user_id": 1,
    "user_nike": "用户昵称",
    "avatar_url": "头像URL",
    "phone": "手机号"
  }
}
```

### 2. 设备管理接口

```python
# POST /api/device/bind/
{
  "device_code": "设备二维码内容"
}

# GET /api/device/list/
# 返回设备列表

# DELETE /api/device/unbind/{device_id}/
# 解绑指定设备
```

### 3. 睡眠数据接口

```python
# GET /api/sleep/stats/
# 返回用户睡眠统计数据
{
  "monitor_days": 30,
  "avg_score": 85,
  "avg_sleep": "7.5h",
  "cbti_courses": 12
}
```

## 开发指南

### 1. 环境准备

1. 安装 HBuilderX
2. 创建 uni-app 项目
3. 配置微信小程序开发者工具

### 2. 开发流程

1. **配置后端地址**
   ```javascript
   // config/config.js
   const API_CONFIG = {
     development: {
       BASE_URL: 'http://your-backend-url/api'
     }
   }
   ```

2. **实现具体页面功能**
   - 参考 `pages/profile/profile.uvue` 的实现方式
   - 使用 `api` 对象调用后端接口
   - 处理加载状态和错误提示

3. **测试接口集成**
   - 确保后端接口正常运行
   - 测试登录、设备绑定等核心功能
   - 验证数据格式和错误处理

### 3. 注意事项

1. **微信小程序限制**
   - 只能请求 HTTPS 接口（生产环境）
   - 需要在微信后台配置服务器域名
   - 开发环境可以开启"不校验合法域名"

2. **错误处理**
   - 所有API调用都应该包装在 try-catch 中
   - 提供用户友好的错误提示
   - 处理网络异常和服务器错误

3. **数据存储**
   - 使用配置文件中定义的存储键名
   - 敏感信息加密存储
   - 定期清理过期数据

## 部署说明

### 1. 开发环境
- 后端：`http://localhost:8000`
- 前端：微信开发者工具预览

### 2. 生产环境
- 配置 HTTPS 域名
- 更新 `config.js` 中的生产环境地址
- 微信后台配置服务器域名白名单
- 提交微信小程序审核

### 3. GitHub Pages 预览
- 仓库地址：`git@github.com:YiHarvest/sleep-app-SomnoVitaFront.git`
- 已配置 GitHub Actions（.github/workflows/deploy-pages.yml）用于自动部署 Pages
- 预览逻辑：
  - 若存在 HBuilderX 构建的 H5 目录（`unpackage/dist/build/h5` 或 `unpackage/dist/h5`），将自动发布该目录到 Pages
  - 若暂未构建 H5，工作流会发布占位页面并提示如何生成 H5 产物
- 使用步骤：
  1. 在本地用 HBuilderX 打包 H5（发行版）
  2. 将构建产物目录（例如 `unpackage/dist/build/h5`）提交并推送到 `main`
  3. 仓库 Settings → Pages → 选择 Source 为 “GitHub Actions”，即可访问 Pages 预览站点

## 联系方式

如有问题，请联系开发团队。
## 历史版本说明与查看引导
- main 分支的提交历史顺序：0505 → 0515 → 0524 → 当前配置代码
- 对应标签：v-0505-Initial_prototype、v-0515-Intermediate_update、v-0524-Stable_baseline
- 查看方法：
  - 命令行：git log --oneline --decorate --graph
  - 切换快照：git checkout tags/v-0505-Initial_prototype（或 0515 / 0524）
  - GitHub：在 Commits 与 Tags 页面查看并跳转
- 历史归档分支：history-archive（集中存放历史说明与引导，不重复存放代码）
