async function addFavorite(inv_id) {
  try {
    const response = await fetch("/favorite/addvehicle", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inv_id })
    });

    const result = await response.json();

    if (result.success) {
      btn.classList.add("favorited")
      btn.style.background = "#ffe28a"
      btn.textContent = "⭐ Favoritado"
    
    }

  } catch (error) {
    console.error(error);
    alert("Erro interno ao adicionar favorito.");
  }
}
