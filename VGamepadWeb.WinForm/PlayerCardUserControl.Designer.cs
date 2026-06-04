namespace VGamepadWeb.WinForm
{
    partial class PlayerCardUserControl
    {
        /// <summary> 
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary> 
        /// Clean up any resources being used.
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

        #region Component Designer generated code

        /// <summary> 
        /// Required method for Designer support - do not modify 
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            tableLayoutPanel1 = new TableLayoutPanel();
            pictureBox1 = new PictureBox();
            lblPlayerName = new Label();
            lblControllerType = new Label();
            tableLayoutPanel1.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)pictureBox1).BeginInit();
            SuspendLayout();
            // 
            // tableLayoutPanel1
            // 
            tableLayoutPanel1.ColumnCount = 2;
            tableLayoutPanel1.ColumnStyles.Add(new ColumnStyle());
            tableLayoutPanel1.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 100F));
            tableLayoutPanel1.Controls.Add(pictureBox1, 0, 0);
            tableLayoutPanel1.Controls.Add(lblPlayerName, 1, 0);
            tableLayoutPanel1.Controls.Add(lblControllerType, 1, 1);
            tableLayoutPanel1.Dock = DockStyle.Fill;
            tableLayoutPanel1.Location = new Point(0, 0);
            tableLayoutPanel1.Name = "tableLayoutPanel1";
            tableLayoutPanel1.RowCount = 2;
            tableLayoutPanel1.RowStyles.Add(new RowStyle(SizeType.Percent, 50F));
            tableLayoutPanel1.RowStyles.Add(new RowStyle(SizeType.Percent, 50F));
            tableLayoutPanel1.Size = new Size(400, 70);
            tableLayoutPanel1.TabIndex = 0;
            // 
            // pictureBox1
            // 
            pictureBox1.Dock = DockStyle.Fill;
            pictureBox1.Image = Properties.Resources.user_svgrepo_com;
            pictureBox1.InitialImage = Properties.Resources.user_svgrepo_com;
            pictureBox1.Location = new Point(3, 3);
            pictureBox1.Name = "pictureBox1";
            tableLayoutPanel1.SetRowSpan(pictureBox1, 2);
            pictureBox1.Size = new Size(65, 64);
            pictureBox1.SizeMode = PictureBoxSizeMode.Zoom;
            pictureBox1.TabIndex = 0;
            pictureBox1.TabStop = false;
            // 
            // lblPlayerName
            // 
            lblPlayerName.Dock = DockStyle.Fill;
            lblPlayerName.Font = new Font("Segoe UI", 13.8F, FontStyle.Regular, GraphicsUnit.Point, 0);
            lblPlayerName.Location = new Point(74, 0);
            lblPlayerName.Name = "lblPlayerName";
            lblPlayerName.Size = new Size(323, 35);
            lblPlayerName.TabIndex = 1;
            lblPlayerName.Text = "Player 0 (ID: 0)";
            // 
            // lblControllerType
            // 
            lblControllerType.Dock = DockStyle.Fill;
            lblControllerType.Font = new Font("Segoe UI", 12F);
            lblControllerType.Location = new Point(74, 35);
            lblControllerType.Name = "lblControllerType";
            lblControllerType.Size = new Size(323, 35);
            lblControllerType.TabIndex = 2;
            lblControllerType.Text = "Type: ";
            lblControllerType.TextAlign = ContentAlignment.MiddleLeft;
            // 
            // PlayerCardUserControl
            // 
            AutoScaleDimensions = new SizeF(8F, 20F);
            AutoScaleMode = AutoScaleMode.Font;
            Controls.Add(tableLayoutPanel1);
            Name = "PlayerCardUserControl";
            Size = new Size(400, 70);
            tableLayoutPanel1.ResumeLayout(false);
            ((System.ComponentModel.ISupportInitialize)pictureBox1).EndInit();
            ResumeLayout(false);
        }

        #endregion

        private TableLayoutPanel tableLayoutPanel1;
        private PictureBox pictureBox1;
        private Label lblPlayerName;
        private Label lblControllerType;
    }
}
