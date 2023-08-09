import "./style.css";
import http from "axios";
import { z } from "zod";


const API_KEY = "nLWaSfZkbebvdIik0TXytDyOhQdo1EaBjRtk9ZZF"

const NasaResponseSchema = z.object({
  url: z.string(),
  explanation: z.string(),
  title: z.string(),
});

type NasaResponse = z.infer<typeof NasaResponseSchema>;

const loadCurrentAPOD = async (): Promise<NasaResponse | null> => {
  const response = await http.get("https://api.nasa.gov/planetary/apod?api_key=" + API_KEY); 
  const data = response.data;

  const result = NasaResponseSchema.safeParse(data) // ha valami nem megfelelő a sémának
  if (!result.success) {
    console.log(result.error)
    return null
  } 

  return result.data;
}

const loadPage = async () => {
  const currentDetails = await loadCurrentAPOD();
  renderDetails(currentDetails)
};

loadPage()

// 
const loadSelectedAPOD = async (selectedDate: string): Promise<NasaResponse | null> => {
  const response = await http.get("https://api.nasa.gov/planetary/apod?date=" + selectedDate + "&api_key=" + API_KEY); 
  const data = response.data;

  const result = NasaResponseSchema.safeParse(data)
  if (!result.success) {
    console.log(result.error)
    return null
  } 
  return result.data;
}

const getSelectedAPOD = async () => {  
  let dateInput = document.getElementById("myDate") as HTMLSelectElement
  let selectedDate = dateInput.value
  const selectedDetails = await loadSelectedAPOD(selectedDate)
  renderDetails(selectedDetails)
}
const button = document.getElementById("load-button")
button?.addEventListener("click", getSelectedAPOD);

getSelectedAPOD();


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
