const chatContainer = document.getElementById("chatContainer");
const username = document.getElementById("username");

let previousDate = "";

const fileInput = document.getElementById("jsonFile");

fileInput.addEventListener("change", (event) => {

    const file = event.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (e) {

        const data = JSON.parse(e.target.result);

        loadConversation(data);

    };

    reader.readAsText(file);

});

function loadConversation(data) {

    previousDate = "";
    chatContainer.innerHTML = "";

    const messages = [...data.messages].reverse();

    const participants = data.participants;

    const chatUser = participants.find(
        p => p.name === "Instagram user"
    );

    if (chatUser) {
        username.textContent = "Instagram user";
    } else {
        username.textContent = decodeInstagramText(participants[0].name);
    }

    const otherPerson = "Instagram user";

    messages.forEach((message, index) => {

        const currentDate = formatDate(message.timestamp_ms);

        if (currentDate !== previousDate) {

            const divider = document.createElement("div");
            divider.className = "date-divider";
            divider.textContent = currentDate;

            chatContainer.appendChild(divider);

            previousDate = currentDate;
        }

        const wrapper = document.createElement("div");
        wrapper.classList.add("message");

        if (message.sender_name === otherPerson) {
            wrapper.classList.add("incoming");
        } else {
            wrapper.classList.add("outgoing");
        }

        const previousMessage = index > 0 ? messages[index - 1] : null;
        const nextMessage = index < messages.length - 1 ? messages[index + 1] : null;

        const sameAsPrevious =
            previousMessage &&
            previousMessage.sender_name === message.sender_name;

        const sameAsNext =
            nextMessage &&
            nextMessage.sender_name === message.sender_name;

        const bubble = document.createElement("div");
        bubble.className = "bubble";

        bubble.textContent = decodeInstagramText(message.content || "");

        if (sameAsPrevious) {
            bubble.classList.add("group-middle");
        } else {
            bubble.classList.add("group-start");
        }

        if (!sameAsNext) {
            bubble.classList.add("group-end");
        }

        wrapper.appendChild(bubble);

        if (message.is_edited) {

            const edited = document.createElement("div");
            edited.className = "edited";
            edited.textContent = "Edited";

            wrapper.appendChild(edited);
        }

        if (message.reactions && message.reactions.length > 0) {

            const reaction = document.createElement("div");
            reaction.className = "reaction";

            reaction.textContent = message.reactions
                .map(r => decodeInstagramText(r.reaction))
                .join(" ");

            bubble.appendChild(reaction);
        }

        const time = document.createElement("div");
        time.className = "time";
        time.textContent = formatTime(message.timestamp_ms);

        wrapper.appendChild(time);

        chatContainer.appendChild(wrapper);

    });

    chatContainer.scrollTop = chatContainer.scrollHeight;

}    

// Scroll Button

document.getElementById("scrollBottom").onclick = () => {

    chatContainer.scrollTo({

        top: chatContainer.scrollHeight,

        behavior: "smooth"

    });

};

if ("serviceWorker" in navigator) {

    window.addEventListener("load", () => {

        navigator.serviceWorker
            .register("service-worker.js")
            .then(() => console.log("Service Worker Registered"))
            .catch(console.error);

    });

}