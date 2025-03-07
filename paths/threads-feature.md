# Threads

So now we will add a feature called Threads. Here is how the app flow works once the feature is added.

## App flow with the feature "Threads"

1. As the user enter the app first time. they see a floating dock at the bottom and blank white screen.
2. User can click on record button to record their voice and that records the audio and sends to deepgram for transcription (this is already happening).
3. Here we introduce thread feature. Thread is basically a collection of notes that user can record. This will help user record multiple notes under one thread to use later.
4. When the user records their first message and transcription is received, another page animatedly opens. Where we have the first note card loaded.
5. The record and write buttons are still available in the floating dock and user can press and record another message, which will generate another note in the same thread. user can keep going like this and add many notes in a thread.
6. User can go back to the main screen, where we will have thread cards, showing some information. clicking on a thread card will open the thread page with all the notes.
7. The write button opens a small modal text area, which instead let's the user input a written note. flow remains the same, if the user presses the write button on the home screen and input a text they generate a new thread. if they are in a thread already and press write button and type out the note, the note gets added into the current thread.
8. When we receive the transcription for a note, along with showing it to the user, we will do an llm call in parallel. The llm call sends all the notes in thread in a strctured format, along with the system prompt, to llm. The llm then generates a Title for the thread, a 1 line description, contextual tags for the thread and based on the latest note it generates 3 "leading explorartory questions" for the user. these leading questions allow user to explore the topic further by asking him relevant questions prompting him to explore further.
9. So the llm is used to generate thread metadata and addition info. Once the llm response is received
   - on the home screen each thread card is updated with title, description and 3 contextual tags.
   - On each thread's page the thread title, description and tags are updated at the top. There is an extra card under the last note in the thread which is then cycling through the 3 questions to let the user explore more on the topic.
   - User can then choose to press the record button choosing to record another note in the thread.
