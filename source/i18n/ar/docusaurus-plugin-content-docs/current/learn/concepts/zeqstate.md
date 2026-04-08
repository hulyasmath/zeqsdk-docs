---
sidebar_position: 10
---
# مغلف ZeqState

كل عملية حسابية تصدرها نواة Zeq تُرجع نتيجتها داخل مظروف **ZeqState**. المغلف هو التسلسل المتعارف عليه لعلامات النواة، ويعيد المدقق اشتقاقها، وينشرها المستكشف. أي شيء ليس داخل ZeqState لا يمكن التحقق منه من خلال البناء.

## تعريف

ZeqState عبارة عن بنية حتمية مسبوقة بالطول تحتوي بالضبط على الحقول المطلوبة لإعادة إنتاج الحساب والتحقق منه:

```
ZeqState := {
  zeqondTick:      uint64,      // integer Zeqonds since the Zeq epoch
  phase:           float64,     // φ ∈ [0, 2π) sampled at Step 0
  pulseHz:         float64,     // 1.287
  zeqondSec:       float64,     // 0.777
  ko42: {
    mode:          "auto" | "manual",
    alpha:         float64,     // 0.00129 in auto mode
    beta:          float64?,    // present only in manual mode
    initialPhase:  float64
  },
  operators:       string[],    // ordered operator chain (KO42 always first)
  inputDigest:     bytes32,     // SHA-256 of canonical input payload
  resultDigest:    bytes32,     // SHA-256 of canonical result payload
  result:          any,         // raw R(t) result
  precisionBound:  float64,     // ≤ 0.1 % under nominal tier
  proof: {
    alg:           "HMAC-SHA256",
    value:         bytes32,     // HMAC over the canonical envelope
    keyId:         string       // public verification path identifier
  }
}
```

تم إصلاح ترتيب الحقول؛ يستخدم التسلسل المتعارف عليه بادئات ذات طول كبير بدون مسافة بيضاء. يؤدي تغيير بايت واحد في أي حقل إلى إبطال الدليل.

## لماذا المغلف على الإطلاق

لا يمكن التحقق من النتيجة العددية المجردة. لا يمكن التحقق من النتيجة المقترنة بالطابع الزمني أيضًا، لأنه لا يوجد شيء يربط الاثنين معًا. ZeqState هو أصغر كائن يرضي جميع ثوابت النواة الأربعة في وقت واحد:

1. **ربط المرحلة** — تم أخذ عينة من `phase` في الخطوة 0 وهي نفس القيمة التي تعدل KO42 المقياس مقابلها. يقوم ZeqProof بإغلاقه، حتى يتمكن المدقق من إعادة اشتقاق φ من `zeqondTick` وتأكيد الاتساق.
2. **ربط المشغل** — تعد مصفوفة `operators` المطلوبة جزءًا من مدخلات HMAC، لذا فإن استبدال سلسلة المشغل بعد الحقيقة يكسر الختم.
3. **ربط الإدخال/الإخراج** — `inputDigest` و`resultDigest` عبارة عن تجزئات للتسلسلات الأساسية لحمولة الطلب وحمولة النتيجة. تغيير الطلب ليناسب النتيجة، أو العكس، يكسر الختم.
4. **الدقة المدركة للمستوى** — `precisionBound` يسجل الخطأ الذي تم تأكيده بواسطة kernel والذي بموجبه تكون النتيجة صالحة. يرفض القائمون على التحقق النتائج التي يكون حدها المطالب به أكثر إحكامًا مما يدعمه مجموعة المشغل/الطبقة.

## دورة الحياة

1. **الخطوة 0 (المرحلة)** تُصدر `zeqondTick` و`phase` جديدين. يقوم هذان الحقلان بملء المغلف أولاً.
2. **الخطوة 1 (KO42)** تكتب الكتلة `ko42`.
3. **الخطوات 2-5** قم بملء `operators` وحساب `inputDigest`.
4. **الخطوة 6 (تنفيذ)** يشغل الحل ويكتب `result` و`resultDigest`.
5. **الخطوة 7 (التحقق)** تقوم بتعيين `precisionBound` وإغلاق المظروف عن طريق حساب HMAC في `proof.value`.

بعد الخطوة 7، يصبح ZeqState غير قابل للتغيير. تقوم النواة بتسليمها إلى المتصل و(إذا تم تمكين Explorer للطلب) تنشر نموذجًا منقحًا في الخلاصة العامة.

## التحقق من ZeqState غير متصل

لا يتطلب التحقق أي مفتاح API ولا يتطلب الوصول إلى الشبكة إلى kernel:

1. أعد حساب التسلسل القانوني من حقول المغلف.
2. أعد اشتقاق φ من `zeqondTick` باستخدام `phase = 2π · frac(zeqondTick · zeqondSec / zeqondSec) = 2π · frac(zeqondTick)`. تأكد من مطابقته `phase` لدقة الماكينة.
3. ابحث عن مفتاح التحقق العام لـ `proof.keyId`.
4. أعد حساب `HMAC-SHA256(verificationKey, canonicalEnvelope)` وقارنها بـ `proof.value` بايت مقابل بايت.

إذا فشلت أي من هذه الخطوات، فسيتم رفض المغلف.

## المراجع التبادلية

- **[ZeqProof](./zeqproof.md)** — طبقة الختم HMAC.
- **[بروتوكول الخطوات السبعة](./seven-step-protocol.md)** — كيفية ملء كل حقل بالترتيب.
- **[Precision Bound](./precision-bound.md)** — كيف يتم حساب `precisionBound` وتنفيذه.
- **[CKO](./cko.md)** — كيف تصبح سلسلة المشغل مشغلًا حركيًا مدمجًا يسجله المغلف.