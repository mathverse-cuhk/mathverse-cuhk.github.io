
// Data file

// BASE_DIR = "../data";
// BASE_DIR = "https://raw.githubusercontent.com/mathvista/data/main"
BASE_DIR = "images"


DATA_FILE = "mv_data_public.js"; // default, answers for testmini, no answer for test

// // Variables for the filters
// let number_options = [20, 50, 100, 200, 500, "All"];   
// let question_types = ["All", "free_form", "multi_choice"];
// let answer_types = ["All", "integer", "float", "list", "text"];
// let languages = ["All", "english", "chinese", "persian"];
// let sources = ["All", "A-OKVQA", "AI2D", "CLEVR-Math", "ChartQA", "DVQA", "DocVQA", "FigureQA", "FunctionQA", "GEOS", "GeoQA+", "Geometry3K", "IQTest", "IconQA", "KVQA", "MapQA", "PMC-VQA", "PaperQA", "ParsVQA-Caps", "PlotQA", "SciBench", "ScienceQA", "Super-CLEVR", "TQA", "TabMWP", "TextVQA", "TheoremQA", "UniGeo", "VQA-AS", "VQA-RAD", "VQA2.0", "VizWiz"];
// let categories = ["All", "general-vqa", "math-targeted-vqa"];
// let tasks = ["All", "figure question answering", "geometry problem solving", "math word problem", "textbook question answering", "visual question answering"];
// let contexts = ["All", "abstract scene", "bar chart", "document image", "function plot", "geometry diagram", "heatmap chart", "line plot", "map chart", "medical image", "natural image", "pie chart", "puzzle test", "radar chart", "scatter plot", "scientific figure", "synthetic scene", "table", "violin plot", "word cloud"];
// let grades = ["All", "not applicable", "elementary school", "high school", "college"];
// let skills = ["All"];

// Variables for the filters with the number of questions
let number_options = [20, 50, 100];  
let question_types = ["All", "free_form", "multi_choice"];
// let sources = ["All", "GEOQA (16)", "GEOS (267)", "Geometry3K (400)", " (317)", "Plane Geometry (Self-Collected) (400)", "Solid Geometry (Self-Collected) (59)", "Function (Self-Collected) (400)"];
let subjects = ["All", "Plane Geometry", "Solid Geometry", "Functions"];
let subfields = ["All", "Plane-G Angle", "Plane-G Length", "Plane-G Applied", "Plane-G Area", "Plane-G Analytic","Solid-G Area", "Solid-G Length", "Solid-G Volume", "Functions Property", "Functions Applied","Functions Expression", "Functions Coordinate"];
let problem_version = ["All", "Text Dominant", "Text Lite", "Text Only", "Vision Intensive", "Vision Dominant", "Vision Only"];

// Elements in the Option Panel
let optbtn = document.getElementsByClassName("optionsbtn")[0];
let closebtn = document.getElementsByClassName("closebtn")[0];
let optionpanel = document.getElementById("option-panel");
let optboxes = document.getElementsByClassName("optbox");
let opt_dds = document.getElementsByClassName("opt-dd");
let filter_submit = document.getElementById("filter-submit");

// Element Text the Option Panel
let number_dd = make_dropdown("How many samples?", number_options, "number_dd");
let question_type_dd = make_dropdown("Choose a question type:", question_types, "question_type_dd");
// let sources_dd = make_dropdown("Choose an answer type:", sources, "sources_dd");
let subjects_dd = make_dropdown("Choose a subject:", subjects, "subjects_dd");
let subfields_dd = make_dropdown("Choose a subfield:", subfields, "subfields_dd");
let problem_version_dd = make_dropdown("Choose a version:", problem_version, "problem_version_dd");


// Content in the Option Box
optboxes[0].innerHTML += number_dd;
optboxes[0].innerHTML += question_type_dd;
// optboxes[0].innerHTML += sources_dd;
optboxes[0].innerHTML += subjects_dd;
optboxes[0].innerHTML += subfields_dd;
optboxes[0].innerHTML += problem_version_dd;


// Elements in the Content Body
let body = document.getElementById("content-body");
let display = document.getElementById("display");

// Click actions for the option buttons
optbtn.addEventListener("click", openNav);
closebtn.addEventListener("click", closeNav);

// Responsive: if screen is narrow, body only displays one column
if (window.innerWidth < 600) {
    body.style.flexDirection = "column";
}

// Set up the data filters and display the page
let filters = {};

for (each of opt_dds) {
    each.addEventListener("change", change_filters);
}

// Display the page when clicking the fresh button
filter_submit.addEventListener("click", filter_data);
if (window.innerWidth < 600) {
    filter_submit.addEventListener("click", closeNav);
}

// Display the page when it is running at the first time
filter_data();

// Functions
var display_padding = display.style.padding;
function openNav() {
    if (window.innerWidth < 600) {
        // optionpanel.style.zIndex = "2";
        optionpanel.style.width = "100vw";
        display.style.width = "0vw";
        display.style.padding = "0";
    } else {
        optionpanel.style.width = "30vw";
        display.style.width = "50vw";
    }
    for (each of optionpanel.children) 
        each.style.display = "block";
}

function closeNav() {
    // display.style.display = "block";
    optionpanel.style.width = "0vw";
    display.style.width = "100vw";
    display
    for (each of optionpanel.children) {
        each.style.display = "none";
    }
}

// Function: update the filter values
function change_filters(e) {
    filters.number = document.getElementById("number_dd").value;
    filters.question_type = document.getElementById("question_type_dd").value;
    // filters.sources = document.getElementById("sources_dd").value;
    filters.subjects = document.getElementById("subjects_dd").value;
    filters.subfields = document.getElementById("subfields_dd").value;
    filters.problem_version = document.getElementById("problem_version_dd").value;
}

// Function: draw the page
function create_page(d) {
    if (d.length === 0) {
        body.innerHTML = "<p>No number satisfies All the filters.</p>";
    } else {
        col1 = create_col(d.slice(0, d.length / 2));
        col2 = create_col(d.slice(d.length / 2));
        body.innerHTML = col1 + col2;
    }
    reflow(body);
    console.log("reflowed");
}

function create_col(data) {
    res = [];

    for (each of data) {
        res.push(create_number(each));
    }

    return `<div class="display-col"> ${res.join("")} </div>`;
}

// data is an object with the following attr.
function create_number(data) {
    let question = make_qt(data.pid, data.question, data.metadata.problem_version, data.unit);

    // let hint = make_hint(data.hint)
    let image = "";
    if (data.image !== null)
        // image = make_img(`${BASE_DImetadataR}/${filters.dataset}/${data.image}`);
        image = make_img(`${BASE_DIR}/${data.image}`);

    let choices = "";
    if (data.question_type === "multi_choice")
        choices = make_choices(data.choices);

    // if data has the answer attr.
    let answer = "";
    if ("answer" in data)
        answer = make_answer(data.answer);

    html = make_box([question, image, choices, answer]) + "<hr/>";

    return html;
}

// creates a div with question text in it
function make_qt(pid, question, problem_version, unit) {
    let html = "";
    if (unit === null)
        html = `
                <p><b>Question </b></p>
                <p class="question-txt">[${problem_version}] ${question}</p>
        `;
    else
        html = `
                <p><b>Question </b></p>
                <p class="question-txt">[No.${pid}] ${question} (unit: ${unit})</p>
        `;
    return html;
}

function make_hint(hint) {
    if (hint === null) return "";
    let html = `<p><b>Context </b></p><p class="hint-txt">${hint}</p>`;
    return html;
}

function make_img(path) {
    if (path === null) return "";
    let html = `<img src="${path}" alt="number image" class="question-img" />`;
    return html;
}

function make_box(contents, cls = "") {
    if (contents.join("").length === 0) return "";
    let html = `
        <div class="box ${cls}"> 
            ${contents.join(" ")}
        </div>
    `;
    return html;
}

function make_choices(choices) {
    // console.log(choices);
    let temp = "";
    let len = 0;
    for (each of choices) {
        let html = make_choice(each);
        temp += html;
        len += each.length;
    }
    let html = "";
    if (len < 60)
        html = `<p><b>Choices </b></p><div class="choices">${temp}</div>`;
    else
        html = `<p><b>Choices </b></p><div class="choices-vertical">${temp}</div>`;
    return html;
}
function make_choice(choice) {
    let html = `<p class="choice-txt">${choice}</p>`;
    return html;
}

function make_answer(answer) {
    let html = `<p><b>Answer </b></p><p class="answer-txt">${answer}</p>`;
    return html;
}

function make_dropdown(label, options, id, default_ind = 0) {
    let html = "";
    for (let i = 0; i < options.length; i++) {
        if (i === default_ind)
            html += `<option value="${options[i]}" selected> ${options[i]} </option>`;
        else
            html += `<option value="${options[i]}"> ${options[i]} </option>`;
    }
    html = `<label class="dd-label">${label} <select id="${id}" class="opt-dd"> ${html} </select> </label><br/>`;
    return html;
}


// Main Functions (FIXME: need to be updated)
async function filter_data() {
    // set up or update the filter
    change_filters();

    console.log(filters);
    // e.g. data/{"dataset": "CLEVR-Math", "number": 20}

    // success event 
    let scriptEle = document.createElement("script");
    // scriptEle.setAttribute("src", `data/${filters.dataset}_test.js`);
    scriptEle.setAttribute("src", `data/${DATA_FILE}`);
    scriptEle.setAttribute("type", "text/javascript");
    scriptEle.setAttribute("async", false);
    document.body.appendChild(scriptEle);

    scriptEle.addEventListener("load", () => {
        console.log("File loaded");
        res = test_data;
        // console.log(res);


        // go over res and add pid to each element
        for (let i of Object.keys(res)) {
            res[i].pid = i;
        }

        // filter: source dataset
        // go through All the res dict and filter the data with the source name
        // split the source name with "-" and get the first element
        // filters.sources = filters.sources.split(" (")[0];
        // if (filters.sources !== "All") {
        //     for (let i of Object.keys(res)) {
        //         if (res[i].metadata.sources.toString() !== filters.sources) {
        //             delete res[i];
        //         }
        //     }
        // }
        // question_type
        filters.question_type = filters.question_type.split(" (")[0];
        if (filters.question_type !== "All") {
            for (let i of Object.keys(res)) {
                if (res[i].question_type.toString() !== filters.question_type) {
                    delete res[i];
                }
            }
        }
        // subjects
        filters.subjects = filters.subjects.split(" (")[0];
        if (filters.subjects !== "All") {
            for (let i of Object.keys(res)) {
                if (res[i].metadata.subjects.toString() !== filters.subjects) {
                    delete res[i];
                }
            }
        }
        // subfields
        filters.subfields = filters.subfields.split(" (")[0];
        if (filters.subfields !== "All") {
            for (let i of Object.keys(res)) {
                if (res[i].metadata.subfields.toString() !== filters.subfields) {
                    delete res[i];
                }
            }
        }
        // problem_version
        filters.problem_version = filters.problem_version.split(" (")[0];
        if (filters.problem_version !== "All") {
            for (let i of Object.keys(res)) {
                if (res[i].metadata.problem_version.toString() !== filters.problem_version) {
                    delete res[i];
                }
            }
        }


        // filter: number
        cnt = filters.number;
        if (cnt != "All") {
            cnt = Number.parseInt(cnt);
            d = _.sample(res, Math.min(cnt, Object.keys(res).length));

        } else {
            d = [];
            for (let i of Object.keys(res)) {
                d.push(res[i]);
            }
        }

        // for (each of d) {
        //     console.log(d);
        // }
        create_page(d);
    });
}

// force the browser to reflow
function reflow(elt) {
    elt.offsetHeight;
}
