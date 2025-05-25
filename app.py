from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

class HospitalAppointmentSystem:
    def __init__(self):
        self.scheduled_patients = set()
        self.appointment = {}

    def book_appointment(self, patient, time):
        if patient in self.scheduled_patients:
            return f"Error: Patient {patient} already has an appointment."
        if time in self.appointment.values():
            return f"Error: Time slot {time} is already taken."
        self.appointment[patient] = time
        self.scheduled_patients.add(patient)
        return f"Appointment booked for {patient} at {time}"

    def cancel_appointment(self, patient):
        if patient not in self.scheduled_patients:
            return f"Error: No appointment found for {patient}"
        del self.appointment[patient]
        self.scheduled_patients.remove(patient)
        return f"Appointment canceled for {patient}"

    def find_appointment(self, patient):
        return self.appointment.get(patient, f"No appointment found for {patient}")

    def update_appointment(self, patient, new_time):
        if patient not in self.appointment:
            return f"Error: No appointment found for {patient}"
        old_time = self.appointment[patient]
        self.appointment[patient] = new_time
        return f"Updated {patient}'s appointment from {old_time} to {new_time}"

system = HospitalAppointmentSystem()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/book', methods=['POST'])
def book():
    patient = request.form['patient']
    time = request.form['time']
    result = system.book_appointment(patient, time)
    return jsonify({
        'result': result,
        'appointments': list(system.appointment.items())
    })

@app.route('/cancel', methods=['POST'])
def cancel():
    patient = request.form['patient']
    result = system.cancel_appointment(patient)
    return jsonify({
        'result': result,
        'appointments': list(system.appointment.items())
    })

@app.route('/find', methods=['POST'])
def find():
    patient = request.form['patient']
    result = system.find_appointment(patient)
    return jsonify({'result': result})

@app.route('/update', methods=['POST'])
def update():
    patient = request.form['patient']
    new_time = request.form['new_time']
    result = system.update_appointment(patient, new_time)
    return jsonify({
        'result': result,
        'appointments': list(system.appointment.items())
    })

@app.route('/chatbot')
def chatbot_window():
    return render_template('chatbot.html')

@app.route('/chatbot', methods=['POST'])
def chatbot_response():
    user_input = request.json['message']
    response = get_chatbot_response(user_input)
    return jsonify({'response': response})

def get_chatbot_response(user_input):
    user_input = user_input.lower()
    responses = {
        "hello": "Hi there! How can I help you today?",
        "appointment": "You can book appointments using the form above!",
        "bye": "Goodbye! Have a great day!",
    }
    return responses.get(user_input, "I'm still learning. Please ask about appointments!")

if __name__ == '__main__':
    app.run(debug=True)