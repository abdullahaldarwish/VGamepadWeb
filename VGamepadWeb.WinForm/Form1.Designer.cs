namespace VGamepadWeb.WinForm
{
    partial class Form1
    {
        /// <summary>
        ///  Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        ///  Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        ///  Required method for Designer support - do not modify
        ///  the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(Form1));
            tableLayoutPanel1 = new TableLayoutPanel();
            groupBoxState = new GroupBox();
            flowLayoutPanel1 = new FlowLayoutPanel();
            panelStatus = new Panel();
            labelState = new Label();
            labelIP = new Label();
            button_Server = new Button();
            groupBox1 = new GroupBox();
            flowLayoutPanelPlayers = new FlowLayoutPanel();
            groupBox2 = new GroupBox();
            flowLayoutPanel2 = new FlowLayoutPanel();
            label1 = new Label();
            textBoxPort = new TextBox();
            label2 = new Label();
            textBoxPassword = new TextBox();
            label_ips = new Label();
            tableLayoutPanel1.SuspendLayout();
            groupBoxState.SuspendLayout();
            flowLayoutPanel1.SuspendLayout();
            groupBox1.SuspendLayout();
            groupBox2.SuspendLayout();
            flowLayoutPanel2.SuspendLayout();
            SuspendLayout();
            // 
            // tableLayoutPanel1
            // 
            tableLayoutPanel1.ColumnCount = 1;
            tableLayoutPanel1.ColumnStyles.Add(new ColumnStyle());
            tableLayoutPanel1.ColumnStyles.Add(new ColumnStyle(SizeType.Absolute, 20F));
            tableLayoutPanel1.Controls.Add(groupBoxState, 0, 0);
            tableLayoutPanel1.Controls.Add(groupBox1, 0, 1);
            tableLayoutPanel1.Controls.Add(groupBox2, 0, 2);
            tableLayoutPanel1.Dock = DockStyle.Fill;
            tableLayoutPanel1.Location = new Point(0, 0);
            tableLayoutPanel1.Name = "tableLayoutPanel1";
            tableLayoutPanel1.RowCount = 3;
            tableLayoutPanel1.RowStyles.Add(new RowStyle(SizeType.Percent, 20F));
            tableLayoutPanel1.RowStyles.Add(new RowStyle(SizeType.Percent, 60F));
            tableLayoutPanel1.RowStyles.Add(new RowStyle(SizeType.Percent, 20F));
            tableLayoutPanel1.Size = new Size(800, 456);
            tableLayoutPanel1.TabIndex = 0;
            // 
            // groupBoxState
            // 
            groupBoxState.Controls.Add(flowLayoutPanel1);
            groupBoxState.Controls.Add(button_Server);
            groupBoxState.Dock = DockStyle.Fill;
            groupBoxState.Location = new Point(3, 3);
            groupBoxState.Name = "groupBoxState";
            groupBoxState.Size = new Size(794, 85);
            groupBoxState.TabIndex = 0;
            groupBoxState.TabStop = false;
            groupBoxState.Text = "SERVER STATUS";
            // 
            // flowLayoutPanel1
            // 
            flowLayoutPanel1.Controls.Add(panelStatus);
            flowLayoutPanel1.Controls.Add(labelState);
            flowLayoutPanel1.Controls.Add(labelIP);
            flowLayoutPanel1.Dock = DockStyle.Left;
            flowLayoutPanel1.Location = new Point(3, 23);
            flowLayoutPanel1.Name = "flowLayoutPanel1";
            flowLayoutPanel1.Size = new Size(483, 59);
            flowLayoutPanel1.TabIndex = 0;
            flowLayoutPanel1.WrapContents = false;
            // 
            // panelStatus
            // 
            panelStatus.Location = new Point(3, 3);
            panelStatus.Name = "panelStatus";
            panelStatus.Size = new Size(52, 52);
            panelStatus.TabIndex = 1;
            panelStatus.Paint += panel1_Paint;
            // 
            // labelState
            // 
            labelState.Dock = DockStyle.Left;
            labelState.Font = new Font("Segoe UI", 13.8F, FontStyle.Regular, GraphicsUnit.Point, 0);
            labelState.ForeColor = Color.Red;
            labelState.Location = new Point(61, 0);
            labelState.Name = "labelState";
            labelState.Size = new Size(125, 58);
            labelState.TabIndex = 0;
            labelState.Text = "STOPPED";
            labelState.TextAlign = ContentAlignment.MiddleLeft;
            // 
            // labelIP
            // 
            labelIP.Anchor = AnchorStyles.Left | AnchorStyles.Right;
            labelIP.Font = new Font("Segoe UI", 13.8F, FontStyle.Regular, GraphicsUnit.Point, 0);
            labelIP.ForeColor = Color.Black;
            labelIP.Location = new Point(192, 0);
            labelIP.Name = "labelIP";
            labelIP.Size = new Size(291, 58);
            labelIP.TabIndex = 2;
            labelIP.Text = "[x.x.x.x:x]";
            labelIP.TextAlign = ContentAlignment.MiddleRight;
            // 
            // button_Server
            // 
            button_Server.Dock = DockStyle.Right;
            button_Server.Font = new Font("Segoe UI", 10.2F, FontStyle.Bold);
            button_Server.ForeColor = Color.Green;
            button_Server.Location = new Point(611, 23);
            button_Server.Name = "button_Server";
            button_Server.Size = new Size(180, 59);
            button_Server.TabIndex = 2;
            button_Server.Text = "🔴  Start Server";
            button_Server.UseVisualStyleBackColor = true;
            button_Server.Click += button_Server_Click;
            // 
            // groupBox1
            // 
            groupBox1.Controls.Add(flowLayoutPanelPlayers);
            groupBox1.Dock = DockStyle.Fill;
            groupBox1.Location = new Point(3, 94);
            groupBox1.Name = "groupBox1";
            groupBox1.Size = new Size(794, 267);
            groupBox1.TabIndex = 2;
            groupBox1.TabStop = false;
            groupBox1.Text = "PLAYERS";
            // 
            // flowLayoutPanelPlayers
            // 
            flowLayoutPanelPlayers.AutoScroll = true;
            flowLayoutPanelPlayers.Dock = DockStyle.Fill;
            flowLayoutPanelPlayers.FlowDirection = FlowDirection.TopDown;
            flowLayoutPanelPlayers.Location = new Point(3, 23);
            flowLayoutPanelPlayers.Name = "flowLayoutPanelPlayers";
            flowLayoutPanelPlayers.Size = new Size(788, 241);
            flowLayoutPanelPlayers.TabIndex = 1;
            flowLayoutPanelPlayers.WrapContents = false;
            // 
            // groupBox2
            // 
            groupBox2.Controls.Add(flowLayoutPanel2);
            groupBox2.Controls.Add(label_ips);
            groupBox2.Dock = DockStyle.Fill;
            groupBox2.Location = new Point(3, 367);
            groupBox2.Name = "groupBox2";
            groupBox2.Size = new Size(794, 86);
            groupBox2.TabIndex = 3;
            groupBox2.TabStop = false;
            groupBox2.Text = "SETTINGS";
            // 
            // flowLayoutPanel2
            // 
            flowLayoutPanel2.AutoScroll = true;
            flowLayoutPanel2.Controls.Add(label1);
            flowLayoutPanel2.Controls.Add(textBoxPort);
            flowLayoutPanel2.Controls.Add(label2);
            flowLayoutPanel2.Controls.Add(textBoxPassword);
            flowLayoutPanel2.Location = new Point(20, 26);
            flowLayoutPanel2.Name = "flowLayoutPanel2";
            flowLayoutPanel2.Size = new Size(765, 30);
            flowLayoutPanel2.TabIndex = 4;
            flowLayoutPanel2.WrapContents = false;
            // 
            // label1
            // 
            label1.Location = new Point(3, 0);
            label1.Name = "label1";
            label1.Size = new Size(38, 30);
            label1.TabIndex = 1;
            label1.Text = "Port:";
            label1.TextAlign = ContentAlignment.MiddleLeft;
            // 
            // textBoxPort
            // 
            textBoxPort.Location = new Point(47, 3);
            textBoxPort.Name = "textBoxPort";
            textBoxPort.Size = new Size(125, 27);
            textBoxPort.TabIndex = 0;
            textBoxPort.Text = "5000";
            // 
            // label2
            // 
            label2.Location = new Point(199, 0);
            label2.Margin = new Padding(24, 0, 3, 0);
            label2.Name = "label2";
            label2.Size = new Size(75, 30);
            label2.TabIndex = 2;
            label2.Text = "Password:";
            label2.TextAlign = ContentAlignment.MiddleLeft;
            // 
            // textBoxPassword
            // 
            textBoxPassword.Location = new Point(280, 3);
            textBoxPassword.Name = "textBoxPassword";
            textBoxPassword.Size = new Size(207, 27);
            textBoxPassword.TabIndex = 3;
            textBoxPassword.TextChanged += textBox1_TextChanged;
            // 
            // label_ips
            // 
            label_ips.Anchor = AnchorStyles.Bottom | AnchorStyles.Left | AnchorStyles.Right;
            label_ips.Location = new Point(20, 59);
            label_ips.Name = "label_ips";
            label_ips.Size = new Size(765, 21);
            label_ips.TabIndex = 3;
            label_ips.Text = "Local IPs: ";
            // 
            // Form1
            // 
            AutoScaleDimensions = new SizeF(8F, 20F);
            AutoScaleMode = AutoScaleMode.Font;
            ClientSize = new Size(800, 456);
            Controls.Add(tableLayoutPanel1);
            Icon = (Icon)resources.GetObject("$this.Icon");
            Name = "Form1";
            Text = "VGamepadWeb";
            tableLayoutPanel1.ResumeLayout(false);
            groupBoxState.ResumeLayout(false);
            flowLayoutPanel1.ResumeLayout(false);
            groupBox1.ResumeLayout(false);
            groupBox2.ResumeLayout(false);
            flowLayoutPanel2.ResumeLayout(false);
            flowLayoutPanel2.PerformLayout();
            ResumeLayout(false);
        }

        #endregion

        private TableLayoutPanel tableLayoutPanel1;
        private GroupBox groupBoxState;
        private FlowLayoutPanel flowLayoutPanel1;
        private Label labelState;
        private Panel panelStatus;
        private Button button_Server;
        private FlowLayoutPanel flowLayoutPanelPlayers;
        private GroupBox groupBox1;
        private GroupBox groupBox2;
        private Label label1;
        private TextBox textBoxPort;
        private Label labelIP;
        private Label label_ips;
        private FlowLayoutPanel flowLayoutPanel2;
        private Label label2;
        private TextBox textBoxPassword;
    }
}
