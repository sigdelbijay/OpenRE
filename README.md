# OpenRE

Open Relation Extraction(OpenRE) is an application built for the thesis work  on Testing QA Systems’ ability in Processing Synonym Commonsense Knowledge.
OpenRE application takes SQUAD 2.0 Dataset and creates new SQUAD 2.0 Dataset with paraphrased questionnaires. It either takes an article paragraph text and array of questions (["question a", "question b"]) from SQUAD 2.0 Dataset and creates new questionnaire or it takes whole/part of SQUAD 2.0 Dataset and regenerates the whole dataset. As the regeneration of whole dataset takes hours to finish, there is option to download already created new SQUAD 2.0 Dataset which has been created using this application.

## Demo

You can see the demo here <http://54.253.98.145:8080/>

## Project setup

- Clone this repository
- Go to client-side folder. Do `npm install`
- Go to server-side folder. Do `npm install`

### Project run

- Go to client-side folder. Do `npm run serve`
- Go to server-side folder. Do `npm start`

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

