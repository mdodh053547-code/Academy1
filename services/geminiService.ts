
import { GoogleGenAI } from "@google/genai";

/**
 * SAFE player insights (never throws)
 */
export async function getPlayerInsights(playerData: any) {
  try {
    // Initializing directly before use to ensure the most up-to-date configuration
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `بصفتك مدرب كرة قدم خبير، قم بتحليل البيانات التالية للاعب ناشئ في أكاديمية بجدة وقدم نصيحة فنية قصيرة وخطة تطوير:
الاسم: ${playerData.name}
الفئة: ${playerData.ageGroup}
المهارات: مراوغة(${playerData.metrics.dribbling}/10)، تمرير(${playerData.metrics.passing}/10)، لياقة(${playerData.metrics.stamina}/10)

المخرجات المطلوبة:
1. نقاط القوة
2. نقاط الضعف
3. تمرين مقترح`,
      config: { temperature: 0.7 },
    });

    // Directly access the .text property as it is a getter, not a method.
    return response.text ?? "التحليل الذكي غير متاح حالياً.";
  } catch (err) {
    console.error("[Gemini] Error:", err);
    return "تعذر الحصول على التحليل الذكي حالياً.";
  }
}

/**
 * SAFE training plan
 */
export async function generateTrainingPlan(teamInfo: string) {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `قم بإنشاء جدول تمارين أسبوعي مكثف لفريق كرة قدم (بنين) بجدة للفئة التالية: ${teamInfo}.`,
    });

    // Directly access the .text property as it is a getter, not a method.
    return response.text ?? "تعذر إنشاء الخطة.";
  } catch (err) {
    console.error("[Gemini] Error:", err);
    return "تعذر إنشاء الخطة.";
  }
}
