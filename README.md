# CMPE295-enterprise-grade-botman

<table>
  <tr>
    <td>
      <p align="justify">
        Botman is an <b>enterprise-grade framework for chatbot development.</b> BotMan aims at creating a service that could be availed by the clients to create bots from their business operations, without getting into the challenges of build them. They would not only be able to configure and view the status of the bot on the service dashboard, but would also be able to decide, analyze and re-structure the response of the bots as per their needs. 
      </p>
    </td>
  </tr>
</table>

## Table of Content

- [Component Design](#component-design)
- [System Architecture](#system-architecture)
- [Project Deliverables](#project-deliverables)
- [UML Diagrams](#uml-diagrams)
- [Team Members](#team-members)

## Component Design

<img src="docs/Diagrams/Component%20Design.jpg" width="450">

- Database: This is the customer's database which can be queried to complete business transactions. Depending on the output from the NLP after processing the user’s input, the database will be queried to fetch the data for the response.

- NLP: This is a set of conversation APIs that are available to the developer for processing user chat. Depending on the relative performance and features offered by an NLP platform, the developer can make a choice from a set of available options.

- Text to speech API: API to convert text to speech and vice versa. For example, Google’s Cloud Speech API.

- Third party API: The framework facilitates integration with any third-party API which the developer can rely on for formulating the Chabot's response. For example, if a developer wants to include real-time weather information as the intent to be handled by the ChatBot, any third-party weather API could be easily integrated.  

- Bot Server: A cloud server platform for ChatBot hosting; IBM, Amazon or Heroku Pass. This is where the operational logic for the ChatBot would be hosted. 

## System Architecture

<img src="docs/Diagrams/System%20Architecture.png" width="450">

<p align="justify">
  The architecture diagram represents how different components in the projects interact with each other. The framework agglomerates the services offered by different platforms to present the user an ideal environment for Chabot development and monitoring.The architecture can be divided into to the following five components:
</p>

- Client Dashboard: The client dashboard is an interactive webpage which gives the user the information about the bots that they create and provides them with the options to change its configurations. Using the console, the user can also create new bots or delete the existing ones.

- DB Module: The DB module takes care of managing the project database. It manages the records for the user. These records include the various bots that the user creates, the configurations of the bot, the NLP service mapping for these bots and any third-party integration that the user choose to include.

- NLP APIs Integration Manager: A wide range of NLP services are available which could be used to understand user intent and respond appropriately. The framework will provide support for two such API services which the user can choose from, to integrate with his ChatBot. The service configurations for each bot would be stored in the database as mapping of intents against questions, which would be used to train the NLP models. It is the integration manager’s responsibility to train the model every time the mapping is created or modified.

- External API: These are the external services other than NLP that the user could integrate with the Chabot. These APIs could be a fixed response type services or could be parameterized ones where the response from the NLP APIs could be used as an input to these external API services. The service response would then be formatted and presented to the end user.

- Deployment Manager: The bots created by the user will be deployed on the cloud. The user would be provided with a list of cloud platforms to choose from where he could deploy these ChatBots. The responsibility of the deployment manager is to take care of setting up the deployment environment, deploy the bots and get regular update of its availability. The status would be presented to the user on his dashboard.


## Project Deliverables

- [Workbook 1] (docs/Workbook%201%20-%20Group%20submission%20Project%20Workbook)
- [Workbook 2] (docs/Workbook%202%20-%20Project%20Design%20and%20Early%20Implementation)
- [Functional Spec Documents] (docs/Functional%20Spec%20Documents)

## UML Diagrams 

  ### Use-case Diagram

  <img src="docs/Diagrams/UML%20Diagrams/Usecase.png" width="500">

  ### Sequence Diagram - NLP Managed Bot

  <img src="docs/Diagrams/UML%20Diagrams/Sequence%20Diagram%20-%20NLP%20Managed%20Bot.jpg" width="500">

  ### Sequence Diagram - QA Type Bot

  <img src="docs/Diagrams/UML%20Diagrams/Sequence%20Diagram%20-%20QA%20Type%20Bot.jpg" width="500">
  

## Team Members

| [![Abhishek Madan](https://avatars.githubusercontent.com/AbhishekMadan?s=100)<br /><sub>Abhishek Madan</sub>](https://github.com/AbhishekMadan)<br /> | [![Aditi Shetty](https://avatars.githubusercontent.com/shettyaditi?s=100)<br /><sub>Aditi Shetty</sub>](https://github.com/shettyaditi)<br />| [![Nachiket Joshi](https://avatars.githubusercontent.com/joshinachiket?s=100)<br /><sub>Nachiket Joshi</sub>](https://github.com/joshinachiket)<br /> | [![Sushant Vairegade](https://avatars.githubusercontent.com/sjsu-sushant?s=100)<br /><sub>Sushant Vairegade</sub>](https://github.com/sjsu-sushant)<br />|
| :---: | :---: | :---: | :---: |
