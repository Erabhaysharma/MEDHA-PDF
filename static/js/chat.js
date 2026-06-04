const sendBtn = document.getElementById("sendBtn");
const questionInput = document.getElementById("question");
const chatContainer = document.getElementById("chatContainer");

/* Auto resize textarea */

questionInput.addEventListener("input", () => {

    questionInput.style.height = "auto";

    questionInput.style.height =
        questionInput.scrollHeight + "px";

});


/* Send on Enter */

questionInput.addEventListener("keydown", (e) => {

    if (e.key === "Enter" && !e.shiftKey) {

        e.preventDefault();

        sendMessage();
    }

});


sendBtn.addEventListener("click", sendMessage);


async function sendMessage() {

    const question = questionInput.value.trim();

    if (!question) return;

    /* Remove welcome screen */

    const welcome = document.querySelector(".welcome");

    if (welcome) {
        welcome.remove();
    }

    /* Add User Message */

    addMessage(question, "user");

    /* Clear Input */

    questionInput.value = "";
    questionInput.style.height = "auto";

    /* Show Thinking Message */

    const thinkingId = showThinking();

    try {

        const response = await fetch("/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                question: question
            })
        });

        const data = await response.json();

        /* Remove Thinking */

        removeThinking(thinkingId);

        if (data.success) {

            addMessage(data.answer, "bot");

        } else {

            addMessage(
                data.message || "Something went wrong.",
                "bot"
            );
        }

    } catch (error) {

        removeThinking(thinkingId);

        addMessage(
            "Unable to connect to server.",
            "bot"
        );

        console.error(error);
    }

}


/* Add Chat Message */

function addMessage(text, sender) {

    const wrapper = document.createElement("div");

    wrapper.classList.add("message");
    wrapper.classList.add(sender);

    const bubble = document.createElement("div");

    bubble.classList.add("bubble");

    bubble.textContent = text;

    wrapper.appendChild(bubble);

    chatContainer.appendChild(wrapper);

    scrollToBottom();
}


/* Thinking Indicator */

function showThinking() {

    const id =
        "thinking-" + Date.now();

    const wrapper =
        document.createElement("div");

    wrapper.classList.add("message");
    wrapper.classList.add("bot");

    wrapper.id = id;

    wrapper.innerHTML = `
        <div class="bubble">
            Thinking...
        </div>
    `;

    chatContainer.appendChild(wrapper);

    scrollToBottom();

    return id;
}


/* Remove Thinking */

function removeThinking(id) {

    const element =
        document.getElementById(id);

    if (element) {

        element.remove();
    }
}


/* Auto Scroll */

function scrollToBottom() {

    chatContainer.scrollTop =
        chatContainer.scrollHeight;
}