const chatContainer =
  document.getElementById(
    "chatContainer"
  );

const messageInput =
  document.getElementById(
    "messageInput"
  );

const sendBtn =
  document.getElementById(
    "sendBtn"
  );

const fileInput =
  document.getElementById(
    "fileInput"
  );

const newChatBtn =
  document.getElementById(
    "newChatBtn"
  );

let generating = false;

let stopGeneration = false;

let autoScroll = true;

let localChats =
  JSON.parse(
    localStorage.getItem(
      "ritesh_chats"
    )
  ) || [];

lucide.createIcons();

chatContainer.addEventListener(
  "scroll",
  () => {

    const threshold = 120;

    const position =
      chatContainer.scrollTop +
      chatContainer.clientHeight;

    const height =
      chatContainer.scrollHeight;

    autoScroll =
      height - position <
      threshold;

  }
);

function smoothScroll() {

  if (!autoScroll)
    return;

  chatContainer.scrollTo({
    top:
      chatContainer.scrollHeight,

    behavior: "smooth",
  });

}

function saveChat() {

  localStorage.setItem(
    "ritesh_chats",

    JSON.stringify(
      localChats
    )
  );

}

function addMessage(
  text,
  sender
) {

  const div =
    document.createElement("div");

  div.classList.add(
    "message"
  );

  div.classList.add(
    sender === "user"
      ? "user-message"
      : "bot-message"
  );

  if (
    sender === "bot"
  ) {

    div.innerHTML =
      marked.parse(text);

  }

  else {

    div.innerText = text;

  }

  chatContainer.appendChild(div);

  smoothScroll();

  localChats.push({
    text,
    sender,
  });

  saveChat();

  return div;
}

function addUploadCard(
  file,
  previewUrl
) {

  const div =
    document.createElement("div");

  div.className =
    "message user-message";

  if (
    file.type.startsWith(
      "image"
    )
  ) {

    div.innerHTML = `
      <div class="upload-card">

        <img
          src="${previewUrl}"
          class="upload-preview"
        />

        <div>
          <strong>${file.name}</strong>
          <p>Image Upload</p>
        </div>

      </div>
    `;

  }

  else {

    div.innerHTML = `
      <div class="upload-card">

        <div class="upload-icon">
          📄
        </div>

        <div>
          <strong>${file.name}</strong>
          <p>Document Upload</p>
        </div>

      </div>
    `;

  }

  chatContainer.appendChild(div);

  smoothScroll();

}

function showTyping() {

  const typing =
    document.createElement("div");

  typing.className =
    "message bot-message";

  typing.id = "typing";

  typing.innerHTML = `
    <div class="typing">
      <span></span>
      <span></span>
      <span></span>
    </div>
  `;

  chatContainer.appendChild(
    typing
  );

  smoothScroll();
}

function removeTyping() {

  const typing =
    document.getElementById(
      "typing"
    );

  if (typing) {
    typing.remove();
  }

}

function setStopButton() {

  sendBtn.innerHTML = `
    <i data-lucide="square"></i>
  `;

  sendBtn.classList.add(
    "stop-mode"
  );

  lucide.createIcons();

}

function setSendButton() {

  sendBtn.innerHTML = `
    <i data-lucide="arrow-up"></i>
  `;

  sendBtn.classList.remove(
    "stop-mode"
  );

  lucide.createIcons();

}

async function sendMessage() {

  const text =
    messageInput.value.trim();

  if (
    !text ||
    generating
  ) return;

  stopGeneration = false;

  autoScroll = true;

  document.querySelector(
    ".welcome"
  )?.remove();

  generating = true;

  setStopButton();

  addMessage(
    text,
    "user"
  );

  messageInput.value = "";

  showTyping();

  try {

    const response =
      await fetch(
        "/api/chat",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            message: text,
          }),
        }
      );

    const data =
      await response.json();

    removeTyping();

    if (!data.response) {

      generating = false;

      setSendButton();

      addMessage(
        "No response received.",
        "bot"
      );

      return;

    }

    const botDiv =
      addMessage(
        "",
        "bot"
      );

    let index = 0;

    const interval =
      setInterval(() => {

        if (
          stopGeneration
        ) {

          clearInterval(
            interval
          );

          generating = false;

          setSendButton();

          return;

        }

        if (
          index <
          data.response.length
        ) {

          botDiv.innerHTML =
            marked.parse(
              data.response.slice(
                0,
                index
              )
            );

          index++;

          smoothScroll();

        }

        else {

          clearInterval(
            interval
          );

          generating = false;

          setSendButton();

        }

      }, 5);

  }

  catch (error) {

    console.error(error);

    removeTyping();

    addMessage(
      "Something went wrong.",
      "bot"
    );

    generating = false;

    setSendButton();

  }

}

sendBtn.addEventListener(
  "click",

  () => {

    if (generating) {

      stopGeneration = true;

      return;

    }

    sendMessage();

  }
);

messageInput.addEventListener(
  "keydown",

  (e) => {

    if (
      e.key === "Enter" &&
      !e.shiftKey
    ) {

      e.preventDefault();

      sendMessage();

    }

  }
);

async function uploadFile(
  file
) {

  const formData =
    new FormData();

  formData.append(
    "file",
    file
  );

  document.querySelector(
    ".welcome"
  )?.remove();

  const previewUrl =
    URL.createObjectURL(
      file
    );

  addUploadCard(
    file,
    previewUrl
  );

  try {

    await fetch(
      "/api/upload",
      {
        method: "POST",
        body: formData,
      }
    );

  }

  catch {

    addMessage(
      "Upload failed.",
      "bot"
    );

  }

}

fileInput.addEventListener(
  "change",

  async () => {

    const file =
      fileInput.files[0];

    if (!file) return;

    await uploadFile(file);

    fileInput.value = "";

    messageInput.focus();

  }
);

window.addEventListener(
  "dragover",
  (e) => {

    e.preventDefault();

    document.body.classList.add(
      "drag-over"
    );

  }
);

window.addEventListener(
  "dragleave",
  () => {

    document.body.classList.remove(
      "drag-over"
    );

  }
);

window.addEventListener(
  "drop",

  async (e) => {

    e.preventDefault();

    document.body.classList.remove(
      "drag-over"
    );

    const file =
      e.dataTransfer.files[0];

    if (!file) return;

    await uploadFile(file);

  }
);

newChatBtn.addEventListener(
  "click",

  async () => {

    await fetch(
      "/api/new-chat",
      {
        method: "POST",
      }
    );

    generating = false;

    stopGeneration = false;

    autoScroll = true;

    setSendButton();

    localChats = [];

    localStorage.removeItem(
      "ritesh_chats"
    );

    chatContainer.innerHTML = `
      <div class="welcome">
        <h2>Hello, Ritesh</h2>

        <p>
          How can I help you today?
        </p>

      </div>
    `;

    messageInput.focus();

  }
);

document.addEventListener(
  "click",
  () => {

    messageInput.focus();

  }
);

window.addEventListener(
  "load",
  () => {

    if (
      localChats.length > 0
    ) {

      chatContainer.innerHTML = "";

      localChats.forEach(
        (msg) => {

          const div =
            document.createElement(
              "div"
            );

          div.classList.add(
            "message"
          );

          div.classList.add(
            msg.sender ===
              "user"
              ? "user-message"
              : "bot-message"
          );

          if (
            msg.sender ===
            "bot"
          ) {

            div.innerHTML =
              marked.parse(
                msg.text
              );

          }

          else {

            div.innerText =
              msg.text;

          }

          chatContainer.appendChild(
            div
          );

        }
      );

      smoothScroll();

    }

    messageInput.focus();

  }
);

setSendButton();