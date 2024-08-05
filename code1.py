from flask import Flask, render_template, request,jsonify
from sendEmail import * 

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/sendEmail', methods=['POST'])
def send_email():
    print("TIPO DA REQUESIÇÃO")
    print(request.content_type)
    if request.content_type == 'application/json; charset=utf-8':
        data = request.json

        assunto = data.get("data", {}).get("assunto", '')
        print("ASSUNTO CODE 1", assunto)
        email = data.get("data", {}).get("email", '')
        cc = data.get("data", {}).get("cc", '')
        destinatario = data.get("data", {}).get("destinatario", '')
      
        enviarEmail(destinatario, assunto, cc, email)
        text = 'Email enviado'
    else:
        text = 'erro'

    return text
    
@app.route('/email.html')
def email():
    return render_template('email.html')

if __name__ == '__main__':
    app.run(debug=True)
