import mustacheEnginee from "mustache"
import fs from "fs/promises"

test("Menggunakan mustache", () => {
    const data = mustacheEnginee.render("Hello {{name}}", {name: "Ricid"})

    expect(data).toBe("Hello Ricid")
})

test("Menggunakan mustache cache", () => {
    mustacheEnginee.parse("Hello {{name}}")
    const data = mustacheEnginee.render("Hello {{name}}", {name: "Ricid"})

    expect(data).toBe("Hello Ricid")
})

test("Tags", () => {
    const data = mustacheEnginee.render("Hello {{name}}, my hobby is {{{hobby}}}", {
        name: "Ricid",
        hobby: "<b>Programming</b>"
    })

    expect(data).toBe("Hello Ricid, my hobby is <b>Programming</b>")
})

test("Nested Object", () => {
    const data = mustacheEnginee.render("Hello {{person.name}}", {
        person: {
            name: "Ricid"
        }
    })

    expect(data).toBe("Hello Ricid")
})

test("Mustache File", async () => {
    const helloTemplate = await fs.readFile("./templates/hello.mustache")
        .then((data) => {
            return data.toString()
        })

    const data = mustacheEnginee.render(helloTemplate, {
        title: "Hello World"
    })

    expect(data).toContain("Hello World")
})

test("Mustache section not show", async () => {
    const helloTemplate = await fs.readFile("./templates/person.mustache")
        .then(data => data.toString())

    const data = mustacheEnginee.render(helloTemplate, {})
    expect(data).not.toContain("Hello Person Ricid")
})

test("Mustache section show", async () => {
    const helloTemplate = await fs.readFile("./templates/person.mustache")
        .then(data => data.toString())

    const data = mustacheEnginee.render(helloTemplate, {
        person: {
            name: "Ricid"
        }
    })

    expect(data).toContain("Hello Person Ricid")
})

test("Inverted Section", async () => {
    const helloTemplate = await fs.readFile("./templates/person.mustache")
        .then(data => data.toString())

    const data = mustacheEnginee.render(helloTemplate, {})

    expect(data).toContain("Hello Guest")
})

test("List / Array", async () => {
    const helloTemplate = await fs.readFile("./templates/hobbies.mustache")
        .then(data => data.toString())

    const data = mustacheEnginee.render(helloTemplate, {
        hobbies: ["Coding", "Gaming", "Reading"]
    })

    expect(data).toContain("Coding")
    expect(data).toContain("Gaming")
    expect(data).toContain("Reading")
})

test("List Object", async () => {
    const helloTemplate = await fs.readFile("./templates/students.mustache")
        .then(data => data.toString())

    const data = mustacheEnginee.render(helloTemplate, {
        students: [
            {name: "Ricid", value: 100},
            {name: "Fulan", value: 100},
        ]
    })

    expect(data).toContain("Ricid")
    expect(data).toContain("Fulan")
    expect(data).toContain("100")
})

test('Function', () => {
    const paramter = {
        name: "Ricid",
        upper: () => {
            return (text, render) => {
                return render(text).toUpperCase()
            }
        }
    }

    const data = mustacheEnginee.render("Hello {{#upper}}{{name}}{{/upper}}", paramter)
    expect(data).toBe("Hello RICID")
})

test("Comment", async () => {
    const helloTemplate = await fs.readFile("./templates/comment.mustache")
        .then(data => data.toString())

    const data = mustacheEnginee.render(helloTemplate, {
        title: "Ricid"
    })

    expect(data).toContain("Ricid")
    expect(data).not.toContain("Ini Komentar")
})

test("Partials", async () => {
    const headerTemplate = await fs.readFile("./templates/header.mustache").then(data => data.toString())
    const contentTemplate = await fs.readFile("./templates/content.mustache").then(data => data.toString())
    const footerTemplate = await fs.readFile("./templates/footer.mustache").then(data => data.toString())

    const data = mustacheEnginee.render(contentTemplate, {
        title: "Belajar Partials",
        content: "Ricid Kumbara",
    }, {
        header: headerTemplate,
        footer: footerTemplate,
    })

    expect(data).toContain("Belajar Partials")
    expect(data).toContain("Ricid Kumbara")
    expect(data).toContain("Powered by Motivator Bugs")
})
