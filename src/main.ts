import "./style.css";
import http from "axios";
import { z } from "zod";

const BASE_URL = "https://api.nasa.gov/planetary/apod"


const NasaResponseSchema = z.object({
  url: z.string(),
  explanation: z.string(),
  title: z.string(),
});

type NasaResponse = z.infer<typeof NasaResponseSchema>;

const getData = async (selectedDate: string) => {
  const response = await http.get(BASE_URL, {
    params: {
      date: selectedDate,
      api_key: "nLWaSfZkbebvdIik0TXytDyOhQdo1EaBjRtk9ZZF"
    }
  })

  return response.data;
}

const loadAPOD = async (selectedDate: string): Promise<NasaResponse | null> => {
  
  const data = getData(selectedDate);

  const result = NasaResponseSchema.safeParse(data)
  if (!result.success) {
    console.log(result.error)
    return null
  } 
  return result.data;
}

const loadPage = async () => {
  const currentDetails = await loadAPOD("");
  renderDetails(currentDetails)
};

loadPage()

const getAPOD = async () => {  
  let dateInput = getDateInput()
  let selectedDate = dateInput.value
  const selectedDetails = await loadAPOD(selectedDate)
  renderDetails(selectedDetails)
}
function getDateInput() {
  const today = new Date().toISOString().split('T')[0];
  document.getElementById("datePicker")!.setAttribute("max", today);
  
  return document.getElementById("datePicker") as HTMLSelectElement
}

const button = document.getElementById("load-button")
button?.addEventListener("click", getAPOD);

getAPOD();


function renderPic(url: string){ 
  document.getElementById("image")?.setAttribute("src", url)
}

function renderTitle(title: string) {
  document.getElementById("title")!.innerHTML = title;
}

function renderExplanation(explanation: string) {
  document.getElementById("explanation")!.innerHTML = explanation;
}

function renderDetails(details: NasaResponse| null) {
  if (details) {
    renderPic(details.url);
    renderTitle(details.title);
    renderExplanation(details.explanation)
  }
}



