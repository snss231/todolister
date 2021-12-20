todolists = Todolist.create([
    {
        name: "My first todolist"
    },
    {
        name: "My second todolist"
    }
])

tasks = Task.create([
    {
        name: "Eat lunch",
        description: "At deck at noon with Jack",
        todolist: todolists.first
    },
    {
        name: "Fart",
        description: "In the toilet, quietly",
        todolist: todolists.first
    }
])
