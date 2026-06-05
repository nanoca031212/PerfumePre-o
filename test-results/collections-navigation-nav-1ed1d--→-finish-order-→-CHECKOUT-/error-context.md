# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: collections-navigation.spec.ts >> navega de Coleções para Checkout via eventos (SELECT → finish order → CHECKOUT)
- Location: tests\e2e\collections-navigation.spec.ts:3:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('heading', { name: 'Order Summary' })
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for getByRole('heading', { name: 'Order Summary' })

```

```yaml
- main:
  - text: Summer deal buy 2 fragrances for $89.99 & get the 3rd FREE
  - link "Logo":
    - /url: http://127.0.0.1:3002/?utm_source=organic&utm_campaign=&utm_medium=&utm_content=&utm_term=
    - img "Logo"
  - img "GBP"
  - button "Looking for something specific?"
  - navigation:
    - link "SPECIAL OFFERS":
      - /url: http://127.0.0.1:3002/?utm_source=organic&utm_campaign=&utm_medium=&utm_content=&utm_term=
    - link "MEN'S":
      - /url: http://127.0.0.1:3002/collections/mens?utm_source=organic&utm_campaign=&utm_medium=&utm_content=&utm_term=
    - link "WOMEN'S":
      - /url: http://127.0.0.1:3002/collections/womens?utm_source=organic&utm_campaign=&utm_medium=&utm_content=&utm_term=
  - main:
    - img "Selected 1"
    - text: "1"
    - button "SORT BY"
    - button "FILTER"
    - link "212 Men Summer deal buy 2 fragrances for $89.99 & get the 3rd FREE 212 Men Eau de Parfum Spray - 100ML £36.99 £121.00":
      - /url: http://127.0.0.1:3002/products/212-men-carolina-herrera-edt?utm_source=organic&utm_campaign=&utm_medium=&utm_content=&utm_term=
      - img "212 Men"
      - text: Summer deal buy 2 fragrances for $89.99 & get the 3rd FREE
      - heading "212 Men" [level=3]
      - text: Eau de Parfum Spray - 100ML £36.99 £121.00
    - button "SELECT"
    - button "REMOVE"
    - button "finish order"
    - link "Amadeirado Floral Fragrância Marcante Summer deal buy 2 fragrances for $89.99 & get the 3rd FREE Amadeirado Floral Fragrância Marcante Eau de Parfum Spray - 100ML £38.99 £133.00":
      - /url: http://127.0.0.1:3002/products/amadeirado-floral-fragr-ncia-marcante?utm_source=organic&utm_campaign=&utm_medium=&utm_content=&utm_term=
      - img "Amadeirado Floral Fragrância Marcante"
      - text: Summer deal buy 2 fragrances for $89.99 & get the 3rd FREE
      - heading "Amadeirado Floral Fragrância Marcante" [level=3]
      - text: Eau de Parfum Spray - 100ML £38.99 £133.00
    - button "SELECT"
    - button "finish order"
    - link "Armaf Club de Nuit Intense Man Armaf Summer deal buy 2 fragrances for $89.99 & get the 3rd FREE Armaf Club de Nuit Intense Man Armaf Eau de Parfum Spray - 100ML £38.99 £131.00":
      - /url: http://127.0.0.1:3002/products/armaf-club-de-nuit-intense?utm_source=organic&utm_campaign=&utm_medium=&utm_content=&utm_term=
      - img "Armaf Club de Nuit Intense Man Armaf"
      - text: Summer deal buy 2 fragrances for $89.99 & get the 3rd FREE
      - heading "Armaf Club de Nuit Intense Man Armaf" [level=3]
      - text: Eau de Parfum Spray - 100ML £38.99 £131.00
    - button "SELECT"
    - button "finish order"
    - link "Armani Beauty Eau pour Homme Pour homme Summer deal buy 2 fragrances for $89.99 & get the 3rd FREE Armani Beauty Eau pour Homme Pour homme Eau de Parfum Spray - 100ML £41.99 £140.00":
      - /url: http://127.0.0.1:3002/products/armani-beauty-eau-pour-homme-pour-homme?utm_source=organic&utm_campaign=&utm_medium=&utm_content=&utm_term=
      - img "Armani Beauty Eau pour Homme Pour homme"
      - text: Summer deal buy 2 fragrances for $89.99 & get the 3rd FREE
      - heading "Armani Beauty Eau pour Homme Pour homme" [level=3]
      - text: Eau de Parfum Spray - 100ML £41.99 £140.00
    - button "SELECT"
    - button "finish order"
    - link "Emporio Armani Stronger With You Summer deal buy 2 fragrances for $89.99 & get the 3rd FREE Emporio Armani Stronger With You Eau de Parfum Spray - 100ML £38.99 £135.00":
      - /url: http://127.0.0.1:3002/products/armani-beauty-stronger-with-you-intensely?utm_source=organic&utm_campaign=&utm_medium=&utm_content=&utm_term=
      - img "Emporio Armani Stronger With You"
      - text: Summer deal buy 2 fragrances for $89.99 & get the 3rd FREE
      - heading "Emporio Armani Stronger With You" [level=3]
      - text: Eau de Parfum Spray - 100ML £38.99 £135.00
    - button "SELECT"
    - button "finish order"
    - link "Armani Code Giorgio Armani Summer deal buy 2 fragrances for $89.99 & get the 3rd FREE Armani Code Giorgio Armani Eau de Parfum Spray - 100ML £40.99 £153.00":
      - /url: http://127.0.0.1:3002/products/armani-code-giorgio-armani?utm_source=organic&utm_campaign=&utm_medium=&utm_content=&utm_term=
      - img "Armani Code Giorgio Armani"
      - text: Summer deal buy 2 fragrances for $89.99 & get the 3rd FREE
      - heading "Armani Code Giorgio Armani" [level=3]
      - text: Eau de Parfum Spray - 100ML £40.99 £153.00
    - button "SELECT"
    - button "finish order"
    - link "Azzaro Pour Homme Eau De Toilette Summer deal buy 2 fragrances for $89.99 & get the 3rd FREE Azzaro Pour Homme Eau De Toilette Eau de Parfum Spray - 100ML £38.99 £134.00":
      - /url: http://127.0.0.1:3002/products/azzaro-pour-homme-eau-de-toilette?utm_source=organic&utm_campaign=&utm_medium=&utm_content=&utm_term=
      - img "Azzaro Pour Homme Eau De Toilette"
      - text: Summer deal buy 2 fragrances for $89.99 & get the 3rd FREE
      - heading "Azzaro Pour Homme Eau De Toilette" [level=3]
      - text: Eau de Parfum Spray - 100ML £38.99 £134.00
    - button "SELECT"
    - button "finish order"
    - link "Bad Boy Carolina Herrera Summer deal buy 2 fragrances for $89.99 & get the 3rd FREE Bad Boy Carolina Herrera Eau de Parfum Spray - 100ML £41.99 £141.00":
      - /url: http://127.0.0.1:3002/products/bad-boy-extreme-eau-de-parfum?utm_source=organic&utm_campaign=&utm_medium=&utm_content=&utm_term=
      - img "Bad Boy Carolina Herrera"
      - text: Summer deal buy 2 fragrances for $89.99 & get the 3rd FREE
      - heading "Bad Boy Carolina Herrera" [level=3]
      - text: Eau de Parfum Spray - 100ML £41.99 £141.00
    - button "SELECT"
    - button "finish order"
    - link "Bleu de Chanel Chanel Summer deal buy 2 fragrances for $89.99 & get the 3rd FREE Bleu de Chanel Chanel Eau de Parfum Spray - 100ML £38.99 £134.00":
      - /url: http://127.0.0.1:3002/products/bleu-de-chanel-eau-de-toilette?utm_source=organic&utm_campaign=&utm_medium=&utm_content=&utm_term=
      - img "Bleu de Chanel Chanel"
      - text: Summer deal buy 2 fragrances for $89.99 & get the 3rd FREE
      - heading "Bleu de Chanel Chanel" [level=3]
      - text: Eau de Parfum Spray - 100ML £38.99 £134.00
    - button "SELECT"
    - button "finish order"
    - link "Bleu De Chanel Parfum Summer deal buy 2 fragrances for $89.99 & get the 3rd FREE Bleu De Chanel Parfum Eau de Parfum Spray - 100ML £39.99 £142.00":
      - /url: http://127.0.0.1:3002/products/bleu-de-chanel-parfum?utm_source=organic&utm_campaign=&utm_medium=&utm_content=&utm_term=
      - img "Bleu De Chanel Parfum"
      - text: Summer deal buy 2 fragrances for $89.99 & get the 3rd FREE
      - heading "Bleu De Chanel Parfum" [level=3]
      - text: Eau de Parfum Spray - 100ML £39.99 £142.00
    - button "SELECT"
    - button "finish order"
    - link "Boss The Scent Hugo Boss Summer deal buy 2 fragrances for $89.99 & get the 3rd FREE Boss The Scent Hugo Boss Eau de Parfum Spray - 100ML £36.99 £126.00":
      - /url: http://127.0.0.1:3002/products/boss-the-scent-hugo-boss?utm_source=organic&utm_campaign=&utm_medium=&utm_content=&utm_term=
      - img "Boss The Scent Hugo Boss"
      - text: Summer deal buy 2 fragrances for $89.99 & get the 3rd FREE
      - heading "Boss The Scent Hugo Boss" [level=3]
      - text: Eau de Parfum Spray - 100ML £36.99 £126.00
    - button "SELECT"
    - button "finish order"
    - link "Boss Bottled Infinite Hugo Boss Summer deal buy 2 fragrances for $89.99 & get the 3rd FREE Boss Bottled Infinite Hugo Boss Eau de Parfum Spray - 100ML £39.99 £145.00":
      - /url: http://127.0.0.1:3002/products/bottled-infinite?utm_source=organic&utm_campaign=&utm_medium=&utm_content=&utm_term=
      - img "Boss Bottled Infinite Hugo Boss"
      - text: Summer deal buy 2 fragrances for $89.99 & get the 3rd FREE
      - heading "Boss Bottled Infinite Hugo Boss" [level=3]
      - text: Eau de Parfum Spray - 100ML £39.99 £145.00
    - button "SELECT"
    - button "finish order"
    - link "Bulgari In Black Bulgari Summer deal buy 2 fragrances for $89.99 & get the 3rd FREE Bulgari In Black Bulgari Eau de Parfum Spray - 100ML £39.99 £143.00":
      - /url: http://127.0.0.1:3002/products/bvlgari-man-in-black-parfum?utm_source=organic&utm_campaign=&utm_medium=&utm_content=&utm_term=
      - img "Bulgari In Black Bulgari"
      - text: Summer deal buy 2 fragrances for $89.99 & get the 3rd FREE
      - heading "Bulgari In Black Bulgari" [level=3]
      - text: Eau de Parfum Spray - 100ML £39.99 £143.00
    - button "SELECT"
    - button "finish order"
    - link "Byredo Rose of No Man's Land Byredo Summer deal buy 2 fragrances for $89.99 & get the 3rd FREE Byredo Rose of No Man's Land Byredo Eau de Parfum Spray - 100ML £40.99 £149.00":
      - /url: http://127.0.0.1:3002/products/byredo-rose-of-no-man-s-land?utm_source=organic&utm_campaign=&utm_medium=&utm_content=&utm_term=
      - img "Byredo Rose of No Man's Land Byredo"
      - text: Summer deal buy 2 fragrances for $89.99 & get the 3rd FREE
      - heading "Byredo Rose of No Man's Land Byredo" [level=3]
      - text: Eau de Parfum Spray - 100ML £40.99 £149.00
    - button "SELECT"
    - button "finish order"
    - link "Creed Aventus Creed Summer deal buy 2 fragrances for $89.99 & get the 3rd FREE Creed Aventus Creed Eau de Parfum Spray - 100ML £39.99 £142.00":
      - /url: http://127.0.0.1:3002/products/creed-aventus?utm_source=organic&utm_campaign=&utm_medium=&utm_content=&utm_term=
      - img "Creed Aventus Creed"
      - text: Summer deal buy 2 fragrances for $89.99 & get the 3rd FREE
      - heading "Creed Aventus Creed" [level=3]
      - text: Eau de Parfum Spray - 100ML £39.99 £142.00
    - button "SELECT"
    - button "finish order"
    - link "Parfums de Marly Layton Summer deal buy 2 fragrances for $89.99 & get the 3rd FREE Parfums de Marly Layton Eau de Parfum Spray - 100ML £39.99 £143.00":
      - /url: http://127.0.0.1:3002/products/de-nicho-layton?utm_source=organic&utm_campaign=&utm_medium=&utm_content=&utm_term=
      - img "Parfums de Marly Layton"
      - text: Summer deal buy 2 fragrances for $89.99 & get the 3rd FREE
      - heading "Parfums de Marly Layton" [level=3]
      - text: Eau de Parfum Spray - 100ML £39.99 £143.00
    - button "SELECT"
    - button "finish order"
    - link "Dior Sauvage Dior Summer deal buy 2 fragrances for $89.99 & get the 3rd FREE Dior Sauvage Dior Eau de Parfum Spray - 100ML £40.99 £145.00":
      - /url: http://127.0.0.1:3002/products/dior-sauvage-eau-de-toilette?utm_source=organic&utm_campaign=&utm_medium=&utm_content=&utm_term=
      - img "Dior Sauvage Dior"
      - text: Summer deal buy 2 fragrances for $89.99 & get the 3rd FREE
      - heading "Dior Sauvage Dior" [level=3]
      - text: Eau de Parfum Spray - 100ML £40.99 £145.00
    - button "SELECT"
    - button "finish order"
    - link "D&G Light Blue Summer deal buy 2 fragrances for $89.99 & get the 3rd FREE D&G Light Blue Eau de Parfum Spray - 100ML £36.99 £125.00":
      - /url: http://127.0.0.1:3002/products/dolce-gabbana-light-blue-eau-de-toilette?utm_source=organic&utm_campaign=&utm_medium=&utm_content=&utm_term=
      - img "D&G Light Blue"
      - text: Summer deal buy 2 fragrances for $89.99 & get the 3rd FREE
      - heading "D&G Light Blue" [level=3]
      - text: Eau de Parfum Spray - 100ML £36.99 £125.00
    - button "SELECT"
    - button "finish order"
    - link "Eau de Parfum Guerlain L'Homme Idéal L'Intense Summer deal buy 2 fragrances for $89.99 & get the 3rd FREE Eau de Parfum Guerlain L'Homme Idéal L'Intense Eau de Parfum Spray - 100ML £38.99 £133.00":
      - /url: http://127.0.0.1:3002/products/eau-de-parfum-guerlain-l-homme-id-al-l-intense?utm_source=organic&utm_campaign=&utm_medium=&utm_content=&utm_term=
      - img "Eau de Parfum Guerlain L'Homme Idéal L'Intense"
      - text: Summer deal buy 2 fragrances for $89.99 & get the 3rd FREE
      - heading "Eau de Parfum Guerlain L'Homme Idéal L'Intense" [level=3]
      - text: Eau de Parfum Spray - 100ML £38.99 £133.00
    - button "SELECT"
    - button "finish order"
    - link "Ferrari Black Ferrari Summer deal buy 2 fragrances for $89.99 & get the 3rd FREE Ferrari Black Ferrari Eau de Parfum Spray - 100ML £41.99 £139.00":
      - /url: http://127.0.0.1:3002/products/ferrari-black-eau-de-toilette?utm_source=organic&utm_campaign=&utm_medium=&utm_content=&utm_term=
      - img "Ferrari Black Ferrari"
      - text: Summer deal buy 2 fragrances for $89.99 & get the 3rd FREE
      - heading "Ferrari Black Ferrari" [level=3]
      - text: Eau de Parfum Spray - 100ML £41.99 £139.00
    - button "SELECT"
    - button "finish order"
    - link "French Avenue Royal Blend Extrait De Parfum Summer deal buy 2 fragrances for $89.99 & get the 3rd FREE French Avenue Royal Blend Extrait De Parfum Eau de Parfum Spray - 100ML £41.99 £145.00":
      - /url: http://127.0.0.1:3002/products/french-avenue-royal-blend-extrait-de-parfum?utm_source=organic&utm_campaign=&utm_medium=&utm_content=&utm_term=
      - img "French Avenue Royal Blend Extrait De Parfum"
      - text: Summer deal buy 2 fragrances for $89.99 & get the 3rd FREE
      - heading "French Avenue Royal Blend Extrait De Parfum" [level=3]
      - text: Eau de Parfum Spray - 100ML £41.99 £145.00
    - button "SELECT"
    - button "finish order"
    - link "Gentleman Réserve Privée Givenchy Summer deal buy 2 fragrances for $89.99 & get the 3rd FREE Gentleman Réserve Privée Givenchy Eau de Parfum Spray - 100ML £40.99 £146.00":
      - /url: http://127.0.0.1:3002/products/gentleman-r-serve-priv-e-givenchy?utm_source=organic&utm_campaign=&utm_medium=&utm_content=&utm_term=
      - img "Gentleman Réserve Privée Givenchy"
      - text: Summer deal buy 2 fragrances for $89.99 & get the 3rd FREE
      - heading "Gentleman Réserve Privée Givenchy" [level=3]
      - text: Eau de Parfum Spray - 100ML £40.99 £146.00
    - button "SELECT"
    - button "finish order"
    - link "Acqua di Gio Profondo Giorgio Armani Summer deal buy 2 fragrances for $89.99 & get the 3rd FREE Acqua di Gio Profondo Giorgio Armani Eau de Parfum Spray - 100ML £38.99 £130.00":
      - /url: http://127.0.0.1:3002/products/giorgio-armani-acqua-di-gi-profondo?utm_source=organic&utm_campaign=&utm_medium=&utm_content=&utm_term=
      - img "Acqua di Gio Profondo Giorgio Armani"
      - text: Summer deal buy 2 fragrances for $89.99 & get the 3rd FREE
      - heading "Acqua di Gio Profondo Giorgio Armani" [level=3]
      - text: Eau de Parfum Spray - 100ML £38.99 £130.00
    - button "SELECT"
    - button "finish order"
    - link "Givenchy Gentleman Givenchy Summer deal buy 2 fragrances for $89.99 & get the 3rd FREE Givenchy Gentleman Givenchy Eau de Parfum Spray - 100ML £39.99 £140.00":
      - /url: http://127.0.0.1:3002/products/givenchy-gentleman-society-ambr-e?utm_source=organic&utm_campaign=&utm_medium=&utm_content=&utm_term=
      - img "Givenchy Gentleman Givenchy"
      - text: Summer deal buy 2 fragrances for $89.99 & get the 3rd FREE
      - heading "Givenchy Gentleman Givenchy" [level=3]
      - text: Eau de Parfum Spray - 100ML £39.99 £140.00
    - button "SELECT"
    - button "finish order"
    - link "Gucci Guilty Pour Homme Gucci Summer deal buy 2 fragrances for $89.99 & get the 3rd FREE Gucci Guilty Pour Homme Gucci Eau de Parfum Spray - 100ML £39.99 £140.00":
      - /url: http://127.0.0.1:3002/products/gucci-guilty-pour-homme-eau-de-parfum?utm_source=organic&utm_campaign=&utm_medium=&utm_content=&utm_term=
      - img "Gucci Guilty Pour Homme Gucci"
      - text: Summer deal buy 2 fragrances for $89.99 & get the 3rd FREE
      - heading "Gucci Guilty Pour Homme Gucci" [level=3]
      - text: Eau de Parfum Spray - 100ML £39.99 £140.00
    - button "SELECT"
    - button "finish order"
    - link "Hugo Boss Perfume Bottled Summer deal buy 2 fragrances for $89.99 & get the 3rd FREE Hugo Boss Perfume Bottled Eau de Parfum Spray - 100ML £38.99 £131.00":
      - /url: http://127.0.0.1:3002/products/hugo-boss-perfume-bottled?utm_source=organic&utm_campaign=&utm_medium=&utm_content=&utm_term=
      - img "Hugo Boss Perfume Bottled"
      - text: Summer deal buy 2 fragrances for $89.99 & get the 3rd FREE
      - heading "Hugo Boss Perfume Bottled" [level=3]
      - text: Eau de Parfum Spray - 100ML £38.99 £131.00
    - button "SELECT"
    - button "finish order"
    - link "Initio Oud for Greatness Initio Summer deal buy 2 fragrances for $89.99 & get the 3rd FREE Initio Oud for Greatness Initio Eau de Parfum Spray - 100ML £36.99 £127.00":
      - /url: http://127.0.0.1:3002/products/initio-oud-for-greatness?utm_source=organic&utm_campaign=&utm_medium=&utm_content=&utm_term=
      - img "Initio Oud for Greatness Initio"
      - text: Summer deal buy 2 fragrances for $89.99 & get the 3rd FREE
      - heading "Initio Oud for Greatness Initio" [level=3]
      - text: Eau de Parfum Spray - 100ML £36.99 £127.00
    - button "SELECT"
    - button "finish order"
    - link "Invictus Paco Rabanne Summer deal buy 2 fragrances for $89.99 & get the 3rd FREE Invictus Paco Rabanne Eau de Parfum Spray - 100ML £39.99 £142.00":
      - /url: http://127.0.0.1:3002/products/invictus-de-paco-rabanne-eau-de-toilette?utm_source=organic&utm_campaign=&utm_medium=&utm_content=&utm_term=
      - img "Invictus Paco Rabanne"
      - text: Summer deal buy 2 fragrances for $89.99 & get the 3rd FREE
      - heading "Invictus Paco Rabanne" [level=3]
      - text: Eau de Parfum Spray - 100ML £39.99 £142.00
    - button "SELECT"
    - button "finish order"
    - link "Emporio Armani Stronger With You Summer deal buy 2 fragrances for $89.99 & get the 3rd FREE Emporio Armani Stronger With You Eau de Parfum Spray - 100ML £41.99 £135.00":
      - /url: http://127.0.0.1:3002/products/invictus-legend?utm_source=organic&utm_campaign=&utm_medium=&utm_content=&utm_term=
      - img "Emporio Armani Stronger With You"
      - text: Summer deal buy 2 fragrances for $89.99 & get the 3rd FREE
      - heading "Emporio Armani Stronger With You" [level=3]
      - text: Eau de Parfum Spray - 100ML £41.99 £135.00
    - button "SELECT"
    - button "finish order"
    - link "Invictus Victory Paco Rabanne Edp Summer deal buy 2 fragrances for $89.99 & get the 3rd FREE Invictus Victory Paco Rabanne Edp Eau de Parfum Spray - 100ML £39.99 £145.00":
      - /url: http://127.0.0.1:3002/products/invictus-victory-paco-rabanne-edp?utm_source=organic&utm_campaign=&utm_medium=&utm_content=&utm_term=
      - img "Invictus Victory Paco Rabanne Edp"
      - text: Summer deal buy 2 fragrances for $89.99 & get the 3rd FREE
      - heading "Invictus Victory Paco Rabanne Edp" [level=3]
      - text: Eau de Parfum Spray - 100ML £39.99 £145.00
    - button "SELECT"
    - button "finish order"
    - link "Jean Paul Gaultier Le Male Jean Paul Gaultier Summer deal buy 2 fragrances for $89.99 & get the 3rd FREE Jean Paul Gaultier Le Male Jean Paul Gaultier Eau de Parfum Spray - 100ML £40.99 £152.00":
      - /url: http://127.0.0.1:3002/products/jean-paul-gaultier?utm_source=organic&utm_campaign=&utm_medium=&utm_content=&utm_term=
      - img "Jean Paul Gaultier Le Male Jean Paul Gaultier"
      - text: Summer deal buy 2 fragrances for $89.99 & get the 3rd FREE
      - heading "Jean Paul Gaultier Le Male Jean Paul Gaultier" [level=3]
      - text: Eau de Parfum Spray - 100ML £40.99 £152.00
    - button "SELECT"
    - button "finish order"
    - link "Jean Paul Gaultier Le Male Elixir Summer deal buy 2 fragrances for $89.99 & get the 3rd FREE Jean Paul Gaultier Le Male Elixir Eau de Parfum Spray - 100ML £41.99 £140.00":
      - /url: http://127.0.0.1:3002/products/jean-paul-gaultier-le-male-elixir?utm_source=organic&utm_campaign=&utm_medium=&utm_content=&utm_term=
      - img "Jean Paul Gaultier Le Male Elixir"
      - text: Summer deal buy 2 fragrances for $89.99 & get the 3rd FREE
      - heading "Jean Paul Gaultier Le Male Elixir" [level=3]
      - text: Eau de Parfum Spray - 100ML £41.99 £140.00
    - button "SELECT"
    - button "finish order"
    - link "Jean Paul Gaultier Scandal H. Summer deal buy 2 fragrances for $89.99 & get the 3rd FREE Jean Paul Gaultier Scandal H. Eau de Parfum Spray - 100ML £39.99 £145.00":
      - /url: http://127.0.0.1:3002/products/jean-paul-gaultier-scandal?utm_source=organic&utm_campaign=&utm_medium=&utm_content=&utm_term=
      - img "Jean Paul Gaultier Scandal H."
      - text: Summer deal buy 2 fragrances for $89.99 & get the 3rd FREE
      - heading "Jean Paul Gaultier Scandal H." [level=3]
      - text: Eau de Parfum Spray - 100ML £39.99 £145.00
    - button "SELECT"
    - button "finish order"
    - link "Paco Rabanne Ultra Male Summer deal buy 2 fragrances for $89.99 & get the 3rd FREE Paco Rabanne Ultra Male Eau de Parfum Spray - 100ML £41.99 £140.00":
      - /url: http://127.0.0.1:3002/products/jean-paul-gaultier-ultra-male-eau-de-toilette-intense?utm_source=organic&utm_campaign=&utm_medium=&utm_content=&utm_term=
      - img "Paco Rabanne Ultra Male"
      - text: Summer deal buy 2 fragrances for $89.99 & get the 3rd FREE
      - heading "Paco Rabanne Ultra Male" [level=3]
      - text: Eau de Parfum Spray - 100ML £41.99 £140.00
    - button "SELECT"
    - button "finish order"
    - link "Kenzo Homme Eau de Parfum Summer deal buy 2 fragrances for $89.99 & get the 3rd FREE Kenzo Homme Eau de Parfum Eau de Parfum Spray - 100ML £39.99 £142.00":
      - /url: http://127.0.0.1:3002/products/kenzo-homme-eau-de-parfum?utm_source=organic&utm_campaign=&utm_medium=&utm_content=&utm_term=
      - img "Kenzo Homme Eau de Parfum"
      - text: Summer deal buy 2 fragrances for $89.99 & get the 3rd FREE
      - heading "Kenzo Homme Eau de Parfum" [level=3]
      - text: Eau de Parfum Spray - 100ML £39.99 £142.00
    - button "SELECT"
    - button "finish order"
    - link "Le Labo Santal 33 Le Labo Summer deal buy 2 fragrances for $89.99 & get the 3rd FREE Le Labo Santal 33 Le Labo Eau de Parfum Spray - 100ML £38.99 £135.00":
      - /url: http://127.0.0.1:3002/products/le-labo-santal-33?utm_source=organic&utm_campaign=&utm_medium=&utm_content=&utm_term=
      - img "Le Labo Santal 33 Le Labo"
      - text: Summer deal buy 2 fragrances for $89.99 & get the 3rd FREE
      - heading "Le Labo Santal 33 Le Labo" [level=3]
      - text: Eau de Parfum Spray - 100ML £38.99 £135.00
    - button "SELECT"
    - button "finish order"
    - link "Louis Vuitton Imagination Louis Vuitton Summer deal buy 2 fragrances for $89.99 & get the 3rd FREE Louis Vuitton Imagination Louis Vuitton Eau de Parfum Spray - 100ML £40.99 £150.00":
      - /url: http://127.0.0.1:3002/products/louis-vuitton-imagination?utm_source=organic&utm_campaign=&utm_medium=&utm_content=&utm_term=
      - img "Louis Vuitton Imagination Louis Vuitton"
      - text: Summer deal buy 2 fragrances for $89.99 & get the 3rd FREE
      - heading "Louis Vuitton Imagination Louis Vuitton" [level=3]
      - text: Eau de Parfum Spray - 100ML £40.99 £150.00
    - button "SELECT"
    - button "finish order"
    - link "M. Micallef GnTonic Summer deal buy 2 fragrances for $89.99 & get the 3rd FREE M. Micallef GnTonic Eau de Parfum Spray - 100ML £39.99 £141.00":
      - /url: http://127.0.0.1:3002/products/m-micallef-gntonic?utm_source=organic&utm_campaign=&utm_medium=&utm_content=&utm_term=
      - img "M. Micallef GnTonic"
      - text: Summer deal buy 2 fragrances for $89.99 & get the 3rd FREE
      - heading "M. Micallef GnTonic" [level=3]
      - text: Eau de Parfum Spray - 100ML £39.99 £141.00
    - button "SELECT"
    - button "finish order"
    - link "Montblanc Explorer Extreme Eau De Summer deal buy 2 fragrances for $89.99 & get the 3rd FREE Montblanc Explorer Extreme Eau De Eau de Parfum Spray - 100ML £40.99 £145.00":
      - /url: http://127.0.0.1:3002/products/montblanc-explorer-extreme-eau-de?utm_source=organic&utm_campaign=&utm_medium=&utm_content=&utm_term=
      - img "Montblanc Explorer Extreme Eau De"
      - text: Summer deal buy 2 fragrances for $89.99 & get the 3rd FREE
      - heading "Montblanc Explorer Extreme Eau De" [level=3]
      - text: Eau de Parfum Spray - 100ML £40.99 £145.00
    - button "SELECT"
    - button "finish order"
    - link "Moschino Toy Boy Moschino Summer deal buy 2 fragrances for $89.99 & get the 3rd FREE Moschino Toy Boy Moschino Eau de Parfum Spray - 100ML £36.99 £122.00":
      - /url: http://127.0.0.1:3002/products/moschino-toy-boy?utm_source=organic&utm_campaign=&utm_medium=&utm_content=&utm_term=
      - img "Moschino Toy Boy Moschino"
      - text: Summer deal buy 2 fragrances for $89.99 & get the 3rd FREE
      - heading "Moschino Toy Boy Moschino" [level=3]
      - text: Eau de Parfum Spray - 100ML £36.99 £122.00
    - button "SELECT"
    - button "finish order"
    - link "Issey Miyake Nuit d'Issey Summer deal buy 2 fragrances for $89.99 & get the 3rd FREE Issey Miyake Nuit d'Issey Eau de Parfum Spray - 100ML £41.99 £138.00":
      - /url: http://127.0.0.1:3002/products/nuit-d-issey-da-marca-issey-miyake?utm_source=organic&utm_campaign=&utm_medium=&utm_content=&utm_term=
      - img "Issey Miyake Nuit d'Issey"
      - text: Summer deal buy 2 fragrances for $89.99 & get the 3rd FREE
      - heading "Issey Miyake Nuit d'Issey" [level=3]
      - text: Eau de Parfum Spray - 100ML £41.99 £138.00
    - button "SELECT"
    - button "finish order"
    - link "1 Million Parfum Paco Rabanne Summer deal buy 2 fragrances for $89.99 & get the 3rd FREE 1 Million Parfum Paco Rabanne Eau de Parfum Spray - 100ML £40.99 £148.00":
      - /url: http://127.0.0.1:3002/products/one-million-paco-rabanne?utm_source=organic&utm_campaign=&utm_medium=&utm_content=&utm_term=
      - img "1 Million Parfum Paco Rabanne"
      - text: Summer deal buy 2 fragrances for $89.99 & get the 3rd FREE
      - heading "1 Million Parfum Paco Rabanne" [level=3]
      - text: Eau de Parfum Spray - 100ML £40.99 £148.00
    - button "SELECT"
    - button "finish order"
    - link "Orientica Royal Bleu Eau De Parfum Summer deal buy 2 fragrances for $89.99 & get the 3rd FREE Orientica Royal Bleu Eau De Parfum Eau de Parfum Spray - 100ML £39.99 £139.00":
      - /url: http://127.0.0.1:3002/products/orientica-royal-bleu-eau-de-parfum?utm_source=organic&utm_campaign=&utm_medium=&utm_content=&utm_term=
      - img "Orientica Royal Bleu Eau De Parfum"
      - text: Summer deal buy 2 fragrances for $89.99 & get the 3rd FREE
      - heading "Orientica Royal Bleu Eau De Parfum" [level=3]
      - text: Eau de Parfum Spray - 100ML £39.99 £139.00
    - button "SELECT"
    - button "finish order"
    - link "Paco Rabanne Phantom Paco Rabanne Summer deal buy 2 fragrances for $89.99 & get the 3rd FREE Paco Rabanne Phantom Paco Rabanne Eau de Parfum Spray - 100ML £41.99 £144.00":
      - /url: http://127.0.0.1:3002/products/paco-rabanne-phantom?utm_source=organic&utm_campaign=&utm_medium=&utm_content=&utm_term=
      - img "Paco Rabanne Phantom Paco Rabanne"
      - text: Summer deal buy 2 fragrances for $89.99 & get the 3rd FREE
      - heading "Paco Rabanne Phantom Paco Rabanne" [level=3]
      - text: Eau de Parfum Spray - 100ML £41.99 £144.00
    - button "SELECT"
    - button "finish order"
    - link "Prada Luna Rossa Black Prada Summer deal buy 2 fragrances for $89.99 & get the 3rd FREE Prada Luna Rossa Black Prada Eau de Parfum Spray - 100ML £40.99 £152.00":
      - /url: http://127.0.0.1:3002/products/prada-luna-rossa-black?utm_source=organic&utm_campaign=&utm_medium=&utm_content=&utm_term=
      - img "Prada Luna Rossa Black Prada"
      - text: Summer deal buy 2 fragrances for $89.99 & get the 3rd FREE
      - heading "Prada Luna Rossa Black Prada" [level=3]
      - text: Eau de Parfum Spray - 100ML £40.99 £152.00
    - button "SELECT"
    - button "finish order"
    - link "Paco Rabanne Pure XS Summer deal buy 2 fragrances for $89.99 & get the 3rd FREE Paco Rabanne Pure XS Eau de Parfum Spray - 100ML £38.99 £129.00":
      - /url: http://127.0.0.1:3002/products/pure-xs-paco-rabanne-edt?utm_source=organic&utm_campaign=&utm_medium=&utm_content=&utm_term=
      - img "Paco Rabanne Pure XS"
      - text: Summer deal buy 2 fragrances for $89.99 & get the 3rd FREE
      - heading "Paco Rabanne Pure XS" [level=3]
      - text: Eau de Parfum Spray - 100ML £38.99 £129.00
    - button "SELECT"
    - button "finish order"
    - link "Rabanne Phantom Parfum Summer deal buy 2 fragrances for $89.99 & get the 3rd FREE Rabanne Phantom Parfum Eau de Parfum Spray - 100ML £36.99 £119.00":
      - /url: http://127.0.0.1:3002/products/rabanne-phantom-parfum?utm_source=organic&utm_campaign=&utm_medium=&utm_content=&utm_term=
      - img "Rabanne Phantom Parfum"
      - text: Summer deal buy 2 fragrances for $89.99 & get the 3rd FREE
      - heading "Rabanne Phantom Parfum" [level=3]
      - text: Eau de Parfum Spray - 100ML £36.99 £119.00
    - button "SELECT"
    - button "finish order"
    - link "Scandal Pour Homme Summer deal buy 2 fragrances for $89.99 & get the 3rd FREE Scandal Pour Homme Eau de Parfum Spray - 100ML £41.99 £146.00":
      - /url: http://127.0.0.1:3002/products/scandal-pour-homme?utm_source=organic&utm_campaign=&utm_medium=&utm_content=&utm_term=
      - img "Scandal Pour Homme"
      - text: Summer deal buy 2 fragrances for $89.99 & get the 3rd FREE
      - heading "Scandal Pour Homme" [level=3]
      - text: Eau de Parfum Spray - 100ML £41.99 £146.00
    - button "SELECT"
    - button "finish order"
    - link "Silver Scent Jacques Bogart Summer deal buy 2 fragrances for $89.99 & get the 3rd FREE Silver Scent Jacques Bogart Eau de Parfum Spray - 100ML £39.99 £140.00":
      - /url: http://127.0.0.1:3002/products/silver-scent-intense-jacques-bogart-eau-de-toilette?utm_source=organic&utm_campaign=&utm_medium=&utm_content=&utm_term=
      - img "Silver Scent Jacques Bogart"
      - text: Summer deal buy 2 fragrances for $89.99 & get the 3rd FREE
      - heading "Silver Scent Jacques Bogart" [level=3]
      - text: Eau de Parfum Spray - 100ML £39.99 £140.00
    - button "SELECT"
    - button "finish order"
    - link "Tom Ford Tobacco Vanille Summer deal buy 2 fragrances for $89.99 & get the 3rd FREE Tom Ford Tobacco Vanille Eau de Parfum Spray - 100ML £39.99 £144.00":
      - /url: http://127.0.0.1:3002/products/tom-ford-beauty-tobacco-vanille-eau?utm_source=organic&utm_campaign=&utm_medium=&utm_content=&utm_term=
      - img "Tom Ford Tobacco Vanille"
      - text: Summer deal buy 2 fragrances for $89.99 & get the 3rd FREE
      - heading "Tom Ford Tobacco Vanille" [level=3]
      - text: Eau de Parfum Spray - 100ML £39.99 £144.00
    - button "SELECT"
    - button "finish order"
    - link "Valentino Uomo Valentino Summer deal buy 2 fragrances for $89.99 & get the 3rd FREE Valentino Uomo Valentino Eau de Parfum Spray - 100ML £38.99 £129.00":
      - /url: http://127.0.0.1:3002/products/valentino-uomo-born-in-roma?utm_source=organic&utm_campaign=&utm_medium=&utm_content=&utm_term=
      - img "Valentino Uomo Valentino"
      - text: Summer deal buy 2 fragrances for $89.99 & get the 3rd FREE
      - heading "Valentino Uomo Valentino" [level=3]
      - text: Eau de Parfum Spray - 100ML £38.99 £129.00
    - button "SELECT"
    - button "finish order"
    - link "Dylan Blue Versace Summer deal buy 2 fragrances for $89.99 & get the 3rd FREE Dylan Blue Versace Eau de Parfum Spray - 100ML £41.99 £146.00":
      - /url: http://127.0.0.1:3002/products/versace-dylan-blue-eau?utm_source=organic&utm_campaign=&utm_medium=&utm_content=&utm_term=
      - img "Dylan Blue Versace"
      - text: Summer deal buy 2 fragrances for $89.99 & get the 3rd FREE
      - heading "Dylan Blue Versace" [level=3]
      - text: Eau de Parfum Spray - 100ML £41.99 £146.00
    - button "SELECT"
    - button "finish order"
    - link "Versace Eros Versace Summer deal buy 2 fragrances for $89.99 & get the 3rd FREE Versace Eros Versace Eau de Parfum Spray - 100ML £41.99 £137.00":
      - /url: http://127.0.0.1:3002/products/versace-eros-eau-de-parfum?utm_source=organic&utm_campaign=&utm_medium=&utm_content=&utm_term=
      - img "Versace Eros Versace"
      - text: Summer deal buy 2 fragrances for $89.99 & get the 3rd FREE
      - heading "Versace Eros Versace" [level=3]
      - text: Eau de Parfum Spray - 100ML £41.99 £137.00
    - button "SELECT"
    - button "finish order"
    - link "Y Eau de Parfum Yves Saint Laurent Summer deal buy 2 fragrances for $89.99 & get the 3rd FREE Y Eau de Parfum Yves Saint Laurent Eau de Parfum Spray - 100ML £39.99 £142.00":
      - /url: http://127.0.0.1:3002/products/versace-eros-energy-eau-de-parfum?utm_source=organic&utm_campaign=&utm_medium=&utm_content=&utm_term=
      - img "Y Eau de Parfum Yves Saint Laurent"
      - text: Summer deal buy 2 fragrances for $89.99 & get the 3rd FREE
      - heading "Y Eau de Parfum Yves Saint Laurent" [level=3]
      - text: Eau de Parfum Spray - 100ML £39.99 £142.00
    - button "SELECT"
    - button "finish order"
    - link "Xerjoff Erba Pura Xerjoff Summer deal buy 2 fragrances for $89.99 & get the 3rd FREE Xerjoff Erba Pura Xerjoff Eau de Parfum Spray - 100ML £36.99 £120.00":
      - /url: http://127.0.0.1:3002/products/xerjoff-erba-pura-eau-de-parfum?utm_source=organic&utm_campaign=&utm_medium=&utm_content=&utm_term=
      - img "Xerjoff Erba Pura Xerjoff"
      - text: Summer deal buy 2 fragrances for $89.99 & get the 3rd FREE
      - heading "Xerjoff Erba Pura Xerjoff" [level=3]
      - text: Eau de Parfum Spray - 100ML £36.99 £120.00
    - button "SELECT"
    - button "finish order"
    - link "Y by YSL Summer deal buy 2 fragrances for $89.99 & get the 3rd FREE Y by YSL Eau de Parfum Spray - 100ML £39.99 £142.00":
      - /url: http://127.0.0.1:3002/products/y-elixir-ysl-parfum-intense?utm_source=organic&utm_campaign=&utm_medium=&utm_content=&utm_term=
      - img "Y by YSL"
      - text: Summer deal buy 2 fragrances for $89.99 & get the 3rd FREE
      - heading "Y by YSL" [level=3]
      - text: Eau de Parfum Spray - 100ML £39.99 £142.00
    - button "SELECT"
    - button "finish order"
    - link "Y Le Parfum da marca Yves Saint Laurent Summer deal buy 2 fragrances for $89.99 & get the 3rd FREE Y Le Parfum da marca Yves Saint Laurent Eau de Parfum Spray - 100ML £38.99 £135.00":
      - /url: http://127.0.0.1:3002/products/y-le-parfum-da-marca-yves-saint-laurent?utm_source=organic&utm_campaign=&utm_medium=&utm_content=&utm_term=
      - img "Y Le Parfum da marca Yves Saint Laurent"
      - text: Summer deal buy 2 fragrances for $89.99 & get the 3rd FREE
      - heading "Y Le Parfum da marca Yves Saint Laurent" [level=3]
      - text: Eau de Parfum Spray - 100ML £38.99 £135.00
    - button "SELECT"
    - button "finish order"
    - link "1 Million Paco Rabanne Summer deal buy 2 fragrances for $89.99 & get the 3rd FREE 1 Million Paco Rabanne Eau de Parfum Spray - 100ML £41.99 £145.00":
      - /url: http://127.0.0.1:3002/products/paco-rabanne-one-million?utm_source=organic&utm_campaign=&utm_medium=&utm_content=&utm_term=
      - img "1 Million Paco Rabanne"
      - text: Summer deal buy 2 fragrances for $89.99 & get the 3rd FREE
      - heading "1 Million Paco Rabanne" [level=3]
      - text: Eau de Parfum Spray - 100ML £41.99 £145.00
    - button "SELECT"
    - button "finish order"
  - img "The Perfume Shop Footer"
- navigation:
  - button "Stores"
  - button "Rewards"
  - button "Menu"
  - button "My Account"
  - button "1 Basket"
- heading "SHOPPING BAG" [level=2]
- button
- img "212 Men"
- heading "212 Men" [level=3]
- paragraph: Eau de Parfum Spray - 100ML
- paragraph: £36.99
- text: £121.00
- button
- text: "1"
- button
- button "Remove"
- text: Total £121.00 Bundle savings -£84.01 Final Price £36.99
- button "CHECKOUT • £36.99"
- button "Open Next.js Dev Tools":
  - img
- alert
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | 
  3  | test("navega de Coleções para Checkout via eventos (SELECT → finish order → CHECKOUT)", async ({
  4  |   page,
  5  | }) => {
  6  |   await page.goto("/collections/mens");
  7  | 
  8  |   const selectButtons = page.getByRole("button", { name: "SELECT" });
  9  |   await expect(selectButtons.first()).toBeVisible();
  10 |   await selectButtons.first().click();
  11 | 
  12 |   const finishOrder = page
  13 |     .getByRole("button", { name: /finish order/i })
  14 |     .first();
  15 |   await expect(finishOrder).toBeVisible();
  16 |   await finishOrder.click();
  17 | 
  18 |   const checkoutButton = page.getByRole("button", { name: /CHECKOUT/i });
  19 |   await expect(checkoutButton).toBeVisible();
  20 |   await checkoutButton.click();
  21 | 
  22 |   await expect(page).toHaveURL(/\/checkout/);
  23 |   await expect(page.getByText("Your basket is empty")).toHaveCount(0);
  24 |   await expect(
  25 |     page.getByRole("heading", { name: "Order Summary" }),
> 26 |   ).toBeVisible();
     |     ^ Error: expect(locator).toBeVisible() failed
  27 | });
  28 | 
  29 | test("redirect /products → /collections/all renderiza coleção (sem JSON API)", async ({
  30 |   page,
  31 | }) => {
  32 |   await page.goto("/products");
  33 |   await expect(page).toHaveURL(/\/collections\/all/);
  34 | 
  35 |   const selectButtons = page.getByRole("button", { name: "SELECT" });
  36 |   await expect(selectButtons.first()).toBeVisible();
  37 | });
  38 | 
```