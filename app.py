from flask import Flask, send_file, request, jsonify
from flask_cors import CORS
from sympy import symbols, log, sin, cos, tan, exp, sqrt
from sympy.parsing.sympy_parser import parse_expr, standard_transformations, implicit_multiplication_application

app = Flask(__name__)
CORS(app)  # Enable CORS

x = symbols('x')

@app.route('/')
def home():
    return send_file('index.html')

@app.route('/style.css')
def serve_css():
    return send_file('style.css')

@app.route('/script.js')
def serve_js():
    return send_file('script.js')

@app.route('/calculate', methods=['POST'])
def calculate():
    data = request.get_json()
    value = data.get('value')
    operation = data.get('operation')

    try:
        if operation == 'log':
            result = float(log(value).evalf())
        elif operation == 'exp':
            result = float(exp(value).evalf())
        else:
            return jsonify({'error': 'Invalid operation'}), 400

        return jsonify({'result': result})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/evaluate_function', methods=['POST'])
def evaluate_function():
    data = request.get_json()
    func_str = data.get('function')

    try:
        transformations = standard_transformations + (implicit_multiplication_application,)
        local_dict = {
            'x': x,
            'sin': sin,
            'cos': cos,
            'tan': tan,
            'log': log,
            'exp': exp,
            'sqrt': sqrt,
            'e': exp(1),
        }

        expr = parse_expr(func_str.replace('^', '**'), transformations=transformations, local_dict=local_dict)
        x_vals = [i / 2 for i in range(-20, 21)]
        y_vals = []

        for val in x_vals:
            try:
                result = expr.subs(x, val).evalf()
                y_vals.append(float(result) if result.is_real else None)
            except:
                y_vals.append(None)

        return jsonify({'x': x_vals, 'y': y_vals})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)
