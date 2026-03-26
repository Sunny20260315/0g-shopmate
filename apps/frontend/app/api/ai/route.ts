import { extractShopPreference } from '@0g-shopmate/common/src/ai/dashscope';
import { uploadFile } from '@0g-shopmate/common/src/0g/client';
import { ShopPreference } from '@0g-shopmate/types';

export async function POST(req: Request) {
  const { userInput } = await req.json();
  try {
    // 1. 提取偏好
    const preference: ShopPreference = await extractShopPreference(userInput);
    // 2. 0G 存证
    const { txHash, dataRoot } = await uploadFile(preference);
    // 3. 返回结果
    return Response.json({
      success: true,
      preference,
      proof: { txHash, dataRoot },
    });
  } catch (err) {
    return Response.json({ success: false, error: (err as Error).message }, { status: 500 });
  }
}
