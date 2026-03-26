import OpenAI from 'openai';

// 提取用户购物偏好
export const extractShopPreference = async (userInput: string) => {
  try {
    const openai = new OpenAI({
      // 若没有配置环境变量，请用阿里云百炼API Key将下行替换为: apiKey: "sk-xxx",
      // 新加坡和北京地域的API Key不同。获取API Key: https://help.aliyun.com/model-studio/get-api-key
      apiKey: process.env.OPENAI_API_KEY,
      // 以下是北京地域base_url，如果使用新加坡地域的模型，需要将base_url替换为: https://dashscope-intl.aliyuncs.com/compatible-mode/v1
      baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    });
    const completion = await openai.chat.completions.create({
      model: 'qwen-plus', //模型列表: https://help.aliyun.com/model-studio/getting-started/models
      messages: [
        {
          role: 'system',
          content: '提取用户购物偏好（预算、品类、属性、偏好平台等），仅返回JSON格式数据',
        },
        { role: 'user', content: userInput },
      ],
    });
    console.log(completion.choices[0].message.content);
  } catch (error) {
    console.log(`错误信息：${error}`);
    console.log('请参考文档：https://help.aliyun.com/model-studio/developer-reference/error-code');
  }
};
