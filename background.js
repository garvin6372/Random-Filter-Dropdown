chrome.runtime.onInstalled.addListener(() => {
  const fields = [
    // { id: "title", title: "Title" },
    { id: "fullName", title: "Full Name" },
    { id: "gender", title: "Gender" },
    { id: "firstName", title: "First Name" },
    { id: "email", title: "Email" },
    { id: "phone", title: "Phone" },
    { id: "cell", title: "Cell" },
    // { id: "lastName", title: "Last Name" },
    // { id: "streetNumber", title: "Street Number" },
    { id: "streetName", title: "Street Name" },
    // { id: "fullStreet", title: "Street (Full)" },
    { id: "city", title: "City" },
    { id: "state", title: "State" },
    // { id: "country", title: "Country" },
    { id: "postcode", title: "Postcode" },
    // { id: "fullAddress", title: "Address (Full)" },
    // { id: "nationality", title: "Nationality" }
  ];

  chrome.contextMenus.create({
    id: "random-input-root",
    title: "Fill with Random User Data",
    contexts: ["editable"]
  });

  fields.forEach(field => {
    chrome.contextMenus.create({
      id: `random-input-${field.id}`,
      title: field.title,
      parentId: "random-input-root",
      contexts: ["editable"]
    });
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  const field = info.menuItemId.replace("random-input-", "");

  const res = await fetch("https://randomuser.me/api/");
  const data = await res.json();
  const user = data.results[0];

  const valueMap = {
    gender: user.gender,
    title: user.name.title,
    firstName: user.name.first,
    lastName: user.name.last,
    fullName: `${user.name.first} ${user.name.last}`,
    streetNumber: user.location.street.number.toString(),
    streetName: user.location.street.name,
    fullStreet: `${user.location.street.number} ${user.location.street.name}`,
    city: user.location.city,
    state: user.location.state,
    country: user.location.country,
    postcode: user.location.postcode.toString(),
    fullAddress: `${user.location.street.number} ${user.location.street.name}, ${user.location.city}, ${user.location.state}, ${user.location.country}, ${user.location.postcode}`,
    email: user.email,
    phone: user.phone,
    cell: user.cell,
    nationality: user.nat
  };

  const value = valueMap[field] || "";

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: (val) => {
      const active = document.activeElement;
      if (active && (active.tagName === "INPUT" || active.tagName === "TEXTAREA")) {
        active.value = val;
        active.dispatchEvent(new Event('input', { bubbles: true }));
      }
    },
    args: [value]
  });
});
