from fastapi import APIRouter
from pydantic import BaseModel
import random

router = APIRouter()

class ChatRequest(BaseModel):
    content: str
    model: str = "gpt-5.2"

@router.post("/ai/chat")
async def chat_with_ai(request: ChatRequest):
    user_msg = request.content.lower()
    model_used = request.model
    
    model_name = "شات جي بي تي"
    if model_used == "gemini":
        model_name = "جيميني"
    elif model_used == "claude":
        model_name = "كلاود"
        
    response_text = ""
    
    # 1. إجابات مخصصة للأسئلة والاقتراحات الموجودة في الواجهة
    if "أكلات" in user_msg or "طعام" in user_msg or "طبخ" in user_msg:
        response_text = "المطبخ الكويتي لذيذ جداً! 😋 أشهر الأكلات هي 'المجبوس' (دجاج أو لحم مع الرز المتبل)، و'المطبق'، و'الهريس'. وللتحلية عندنا 'الدرابيل' و'القرص عقيلي'. جرب تسأل والدتك عن أكلتها المفضلة!"
        
    elif "سدو" in user_msg or "نسج" in user_msg:
        response_text = "نسج السدو حرفة يدوية تراثية تعتمد على صوف الأغنام ووبر الإبل. لتعلّمها، يمكنك زيارة 'بيت السدو' في الكويت، فهو يقدم ورش عمل رائعة للأطفال والشباب لتعلم هذه الفنون الجميلة! 🧶"
        
    elif "تقاليد" in user_msg or "عادات" in user_msg:
        response_text = "من أهم التقاليد الكويتية هي 'الديوانية' التي تجمع الرجال للحديث والتواصل، وتناول القهوة العربية مع التمر. كما نعتز بـ 'الغبقة' والاحتفال بـ 'القرقيعان' في منتصف شهر رمضان المبارك! ✨☕"
        
    elif "تاريخ" in user_msg or "تأسيس" in user_msg:
        response_text = "تأسست الكويت وتطورت كمركز تجاري مهم في الخليج العربي. وازدهرت قديماً بصيد اللؤلؤ والتجارة البحرية باستخدام السفن الخشبية مثل 'البوم' قبل اكتشاف النفط. تاريخنا مليء بالشجاعة! 🇰🇼⛵"
        
    # 2. الترحيب والأسئلة العامة
    elif "شخبارك" in user_msg or "شلونك" in user_msg or "كيف حالك" in user_msg or "هلا" in user_msg:
        response_text = f"يا هلا وغلا بالبطل! أنا بخير 🐱 (وأرد عليك الحين باستخدام {model_name}). مستعد أساعدك، تبي تسألني عن التراث ولا أذكرك بواجباتك؟"
        
    elif "واجب" in user_msg or "دراسة" in user_msg:
        response_text = "يا بطل! أهم شيء مستقبلك ودراستك. خلص واجباتك الحين وراجع دروسك عشان تصير مهندس أو دكتور كبير وتخدم ديرتك الكويت! يلا ناطرك تخلص وترجع تلعب 🌟📚"
        
    elif "معلومة" in user_msg:
        facts = [
            "هل تعلم أن أبراج الكويت صُممت لتشبه المرش والمبخرة والمكحلة؟ وهي رمز لضيافتنا! 🗼✨",
            "هل تعلم أن جزيرة فيلكا من أقدم الجزر المأهولة في الكويت وكان يُطلق عليها اسم 'إيكاروس'؟ 🏝️"
        ]
        response_text = random.choice(facts)
        
    # 3. الرد الافتراضي لأي سؤال لم نبرمجه
    else:
        response_text = f"يا هلا بك! (أنا {model_name}). سؤالك جميل، بس أنا مبرمج حالياً كنسخة تجريبية لأرد على أسئلة محددة. جرب تسألني عن (أشهر الأكلات)، (كيف أتعلم السدو)، أو (أهم التقاليد)! 🇰🇼"
        
    return {"response": response_text}