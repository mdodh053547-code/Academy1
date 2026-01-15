import { GoogleGenAI } from "@google/genai";

/**
 * SAFE player insights (never throws)
 */
export async function getPlayerInsights(playerData: any) {
  try {
    // @google/genai coding guidelines: Initializing directly before use to ensure the most up-to-date configuration.
    // Use a named parameter for the API key.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // @google/genai coding guidelines: Use 'gemini-3-pro-preview' for complex reasoning/analysis tasks.
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `الاسم: ${playerData.name}
الفئة: ${playerData.ageGroup}
المهارات: مراوغة(${playerData.metrics.dribbling}/10)، تمرير(${playerData.metrics.passing}/10)، لياقة(${playerData.metrics.stamina}/10)`,
      config: { 
        systemInstruction: "بصفتك مدرب كرة قدم خبير، قم بتحليل البيانات التالية للاعب ناشئ في أكاديمية بجدة وقدم نصيحة فنية قصيرة وخطة تطوير. المخرجات المطلوبة تشمل: نقاط القوة، نقاط الضعف، وتمرين مقترح.",
        temperature: 0.7 
      },
    });

    // @google/genai coding guidelines: Directly access the .text property as it is a getter, not a method.
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
    
    // @google/genai coding guidelines: Use 'gemini-3-pro-preview' for advanced planning and reasoning.
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `قم بإنشاء جدول تمارين أسبوعي مكثف لفريق كرة قدم (بنين) بجدة للفئة التالية: ${teamInfo}.`,
      config: {
        systemInstruction: "أنت مدرب كرة قدم محترف متخصص في تخطيط البرامج التدريبية للأكاديميات الناشئة وتطوير مهارات اللاعبين الموهوبين."
      }
    });

    // @google/genai coding guidelines: Directly access the .text property as it is a getter, not a method.
    return response.text ?? "تعذر إنشاء الخطة.";
  } catch (err) {
    console.error("[Gemini] Error:", err);
    return "تعذر إنشاء الخطة.";
  }
}
