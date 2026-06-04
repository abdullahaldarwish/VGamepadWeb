namespace VGamepadWeb.WinForm
{
    public partial class PlayerCardUserControl : UserControl
    {
        public PlayerCardUserControl()
        {
            InitializeComponent();
        }

        // دالة لتحديث بيانات الكرت عند استدعائه
        public void SetPlayerDetails(string playerName, int id, string controllerType)
        {
            lblPlayerName.Text = $"Player {id + 1} (ID: {id})";
            lblControllerType.Text = $"Type: {controllerType}";
        }
    }
}
