import smtplib
from email.mime.multipart import MIMEMultipart

from email.mime.image import MIMEImage
from email.mime.text import MIMEText
import os
from dotenv import load_dotenv

# Carregar variáveis de ambiente
load_dotenv()

# Configurações do e-mail
email_remetente = os.getenv('EMAIL_FROM')
email_senha = os.getenv('EMAIL_PASSWORD')

def enviarEmail(destinatario, assunto, cc, email):
    print("ASSUNTO: ", assunto)
    msg = MIMEMultipart()
    msg['From'] = email_remetente
    msg['To'] = destinatario
    msg['Cc'] = cc
    msg['Subject'] = assunto
    msg.attach(MIMEText(email, 'html'))

    # Conectar ao servidor SMTP e enviar e-mail
    with smtplib.SMTP('smtp.gmail.com', 587) as server:
        server.starttls()
        server.login(email_remetente, email_senha)
        server.sendmail(email_remetente, [destinatario] + [cc], msg.as_string())
