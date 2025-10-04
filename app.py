from flask import Flask, render_template

app = Flask(__name__)

# Sample family data
family_data = {
    'members': [
        {'id': 1, 'name': 'John Smith', 'birth_year': 1920, 'death_year': 1995, 'parent_ids': []},
        {'id': 2, 'name': 'Mary Smith', 'birth_year': 1925, 'death_year': 2010, 'parent_ids': []},
        {'id': 3, 'name': 'Robert Smith', 'birth_year': 1950, 'death_year': None, 'parent_ids': [1, 2]},
        {'id': 4, 'name': 'Sarah Johnson', 'birth_year': 1955, 'death_year': None, 'parent_ids': []},
        {'id': 5, 'name': 'Michael Smith', 'birth_year': 1980, 'death_year': None, 'parent_ids': [3, 4]},
    ]
}

@app.route('/')
def index():
    return render_template('index.html', members=family_data['members'])

@app.route('/member/<int:member_id>')
def member_detail(member_id):
    member = next((m for m in family_data['members'] if m['id'] == member_id), None)
    if member:
        parents = [m for m in family_data['members'] if m['id'] in member['parent_ids']]
        children = [m for m in family_data['members'] if member['id'] in m['parent_ids']]
        return render_template('member.html', member=member, parents=parents, children=children)
    return "Member not found", 404

if __name__ == '__main__':
    app.run(debug=True)
