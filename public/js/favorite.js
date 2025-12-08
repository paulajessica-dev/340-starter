async function addFavorite(inv_id, btn) {
  try {
    const response = await fetch("/favorite/addvehicle", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inv_id })
    })

    let result = null
    try {
      result = await response.json()
    } catch {
      result = { success: response.ok }
    }

    if (result.success) {
      btn.classList.add("favorited")
      btn.style.background = "#ffe28a"
      btn.textContent = "⭐ Favorited"
    } else {
      alert(result.message || "It was not possible to favorite.")
    }

  } catch (error) {
    console.error(error)
    alert("Internal error while adding to favorites.")
  }
}
