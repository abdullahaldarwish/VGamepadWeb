namespace VGamepadWeb.WinForm
{
    internal static class Program
    {
        /// <summary>
        ///  The main entry point for the application.
        /// </summary>
        [STAThread]
        static void Main()
        {
            // To customize application configuration such as set high DPI settings or default font,
            // see https://aka.ms/applicationconfiguration.
            ApplicationConfiguration.Initialize();

            // 🔥 فحص وجود تعريف الـ ViGEmBus وتثبيته تلقائياً إذا كان مفقوداً
            if (!DriverHelper.EnsureViGEmDriverInstalled())
            {
                // إذا فشل التثبيت أو رفض المستخدم إعطاء الصلاحيات، نغلق البرنامج لمنع الانهيار
                MessageBox.Show(
                    "التطبيق يتطلب وجود تعريف ViGEmBus للعمل بشكل صحيح. سيتم إغلاق البرنامج الآن.",
                    "خطأ في بيئة التشغيل",
                    MessageBoxButtons.OK,
                    MessageBoxIcon.Error
                );
                return;
            }

            // إذا كان التعريف موجوداً أو تم تثبيته بنجاح، يفتح البرنامج بشكل طبيعي
            Application.Run(new Form1());
        }
    }
}