import json
import os
import datetime

# Path to store JSON data
json_data_path = "json_data"
if not os.path.exists(json_data_path):
    os.makedirs(json_data_path)

def load_current_task():
    try:
        with open(os.path.join(json_data_path, "current_task.json"), "r") as file:
            return json.load(file)
    except FileNotFoundError:
        return {"project": "mcba", "task": "fix drag and drop", "status": "in progress"}

def save_current_task(data):
    with open(os.path.join(json_data_path, "current_task.json"), "w") as file:
        json.dump(data, file, indent=4)

def add_log_entry(project, task, status, message):
    log_entry = {
        "day": datetime.datetime.now().strftime("%Y-%m-%d"),
        "time": datetime.datetime.now().strftime("%H:%M:%S"),
        "data": {
            "project": project,
            "task": task,
            "status": status,
            "log": message
        }
    }
    log_filename = f"log_{project.replace(' ', '_').lower()}.json"
    log_path = os.path.join(json_data_path, log_filename)
    logs = []
    if os.path.exists(log_path):
        with open(log_path, "r") as file:
            logs = json.load(file)
    logs.append(log_entry)
    with open(log_path, "w") as file:
        json.dump(logs, file, indent=4)

def main_menu():
    current = load_current_task()
    print("/// main menu ///")
    print(f"Current Project: {current['project']}")
    print(f"Current Task: {current['task']}")
    print(f"Status: {current['status'].capitalize()}\n")
    print("1. Add log")
    print("2. Change Project")
    print("3. Change Task")
    print("4. Change the status of the current task")

    choice = input("Choose an option: ")
    if choice == "1":
        message = input("Enter Log: ")
        add_log_entry(current['project'], current['task'], current['status'], message)
        print("Log added successfully!")
    elif choice == "2":
        change_project()
    elif choice == "3":
        change_task()
    elif choice == "4":
        change_status()

def change_project():
    projects = ["mcba", "sunbiz", "airplane"]
    print("\n".join(f"{i+1}. {proj}" for i, proj in enumerate(projects)))
    print("4. Add Project")
    choice = int(input("Select project: ")) - 1
    if 0 <= choice < len(projects):
        current = load_current_task()
        current['project'] = projects[choice]
        current['task'] = input("Enter the task for the new project: ")
        current['status'] = "in progress"
        save_current_task(current)
        main_menu()
    elif choice == 3:
        new_project = input("Enter new project name: ")
        projects.append(new_project)
        change_project()

def change_task():
    tasks = {
        "mcba": ["fix drag and drop", "implement login", "update UI"],
        "sunbiz": ["build backend", "build front end", "debug scrape issue"],
        "airplane": ["design wing", "simulate airflow", "test materials"]
    }
    current = load_current_task()
    project_tasks = tasks.get(current['project'], [])
    print("\n".join(f"{i+1}. {task}" for i, task in enumerate(project_tasks)))
    print(f"{len(project_tasks)+1}. Add the task to {current['project']}")
    choice = int(input("Select task: ")) - 1
    if 0 <= choice < len(project_tasks):
        current['task'] = project_tasks[choice]
        save_current_task(current)
        main_menu()
    elif choice == len(project_tasks):
        new_task = input("Enter new task name: ")
        project_tasks.append(new_task)
        change_task()

def change_status():
    statuses = ["in progress", "completed", "on hold"]
    print("\n".join(f"{i+1}. {status}" for i, status in enumerate(statuses)))
    choice = int(input("Select status: ")) - 1
    if 0 <= choice < len(statuses):
        current = load_current_task()
        current['status'] = statuses[choice]
        save_current_task(current)
        main_menu()

if __name__ == "__main__":
    main_menu()
