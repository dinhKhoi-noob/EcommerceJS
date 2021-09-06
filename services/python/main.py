from flask import Flask,jsonify,make_response, redirect, request, url_for,current_app
from flask_mysqldb import MySQL

app = Flask(__name__)

app.config['MYSQL_HOST'] = '127.0.0.1'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = ''
app.config['MYSQL_DB'] = 'ecommercejs'

mysql = MySQL(app)
@app.route('/', methods=['GET'])
def index():
    return 'Flask'
@app.route('/calculate',methods=['GET', 'POST'])
def post():
    if request.method=='POST':
        print(request)
        cur = mysql.connection.cursor()
        json_data = request.get_json()
        name = json_data['name']
        age = json_data['age']
        cur.execute("Insert into test values("+"'"+str(name)+"',"+"'"+str(age)+"')")
        mysql.connection.commit()
        cur.close()
        response = make_response(
            jsonify(
                {"message": "success","success":True}
            ),
            200,
        )
        response.headers["Content-Type"] = "application/json"
        return response
    if request.method == 'GET':
        print(request)
        cur = mysql.connection.cursor()
        cur.execute("select*from test")
        result = cur.fetchall()
        print(result)
        cur.close()
        if(len(result) > 0):
            response = make_response(
                jsonify(
                    {"message": "success","success":True,"data":result}
                ),
                200,
            )
        else:
            response = make_response(
                jsonify(
                    {"message": "Not found","success":False}
                ),
                400,
            )
        response.headers["Content-Type"] = "application/json"
        return response
if __name__ == '__main__':
    app.run(debug=True)