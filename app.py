from flask import Flask, render_template, session, request, redirect, url_for
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.secret_key = 'peepeepoopoo'
app.config['SQLALCHEMY_DATABASE_URI']='sqlite:///users.sqlite3'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

class users(db.Model):
    _id = db.Column("id", db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    email = db.Column(db.String(100))
    user_score = db.Column(db.Integer)
    comp_score = db.Column(db.Integer)

    def __init__(self, name, email):
        self.name = name
        self.email = email
        self.user_score = 0
        self.comp_score = 0

    def setScore(self, user_score, comp_score):
        self.user_score = user_score
        self.comp_score = comp_score

@app.route('/')
@app.route('/home')
def home():
    if 'user' in session:
        found_user = users.query.filter_by(name=session['user']).first()
        if found_user:
            user_score = found_user.user_score
            comp_score = found_user.comp_score
            return render_template('index.html', user=session['user'], user_score=user_score, comp_score=comp_score)
        else:
            user_score = 0
            comp_score = 0
            return render_template('index.html', user=session['user'], user_score=user_score, comp_score=comp_score)
    else:
        return render_template('index.html', user=None, user_score=0, comp_score=0)

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        user = request.form['name']
        email = request.form['email']
        session['user'] = user
        session['email'] = email
        return redirect(url_for('home'))
    else:
        if 'user' in session:
            return render_template('login.html', user=session['user'])
        else:
            return render_template('login.html', user=None)

@app.route('/logout', methods=['GET', 'POST'])
def logout():
    if request.method == 'POST':
        scores = request.get_json(force=True)
        user_score = scores['user']
        comp_score = scores['comp']
        
        found_user = users.query.filter_by(email=session['email']).first()
        if found_user:
            found_user.setScore(user_score, comp_score)
            db.session.commit()
        else:
            usr = users(session['user'], session['email'])
            db.session.add(usr)
            db.session.commit()

        if 'user' in session:
            session.pop('user', None)
        if 'email' in session:
            session.pop('email', None)

    return redirect(url_for('home'))

if __name__ == '__main__':
    db.create_all()
    app.run(debug=True)