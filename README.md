<a id="readme-top"></a>

[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![LinkedIn][linkedin-shield]][linkedin-url]


<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/rufus582/dev-utils">
    <img src="public/logo-dark.svg" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">Dev-Utils.</h3>
  <p align="center">
    A bunch of useful utilities for developers!
    <br />
    <a href="https://dev-utils-rufus.vercel.app"><strong>Check it out here »</strong></a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>




<!-- ABOUT THE PROJECT -->
## About The Project

[![Product Name Screen Shot][product-screenshot]](https://dev-utils-rufus.vercel.app)

This project aims to provide useful utilities to developers, with a nice UI/UX. This is a frontend-only project built with React, so you can be assured of the privacy & security of your data. Below is the list of utils that are available:
- [Text Converter](https://dev-utils-rufus.vercel.app/text-converter)  - Convert text from/to formats like JSON, YAML, TOML, Base64, CSV
- [JQ Playground](https://dev-utils-rufus.vercel.app/jq)               - Experiment and play around with JQ
- [JMESPATH Playground](https://dev-utils-rufus.vercel.app/jmespath)   - Experiment and play around with JMESPATH
- [JSON Table Viewer](https://dev-utils-rufus.vercel.app/json-table)   - View simple & complex JSON in a simple, yet readable table format
- [SQL Playground](https://dev-utils-rufus.vercel.app/sql)             - Create/import tables from JSON files, and play around it using SQL
- [CEL Playground](https://dev-utils-rufus.vercel.app/jmespath)        - Test & evaluate different conditions using CEL Expression

<h3>Local Only Features</h3>

When you set up this project and run it in your localhost, you can access the below feature(s):
- In [JSON Table Viewer](https://dev-utils-rufus.vercel.app/json-table), you can fetch the JSON content from a given CURL command using the `Fetch from CURL` button

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

* [![React][React.js]][React-url]
* [![Tailwind CSS][TailwindCSS]][TailwindCSS-url]
* [![Vite][Vite]][Vite-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->
## Getting Started

To get a local copy of this project and access the Local Only Features, follow the below steps.

### Prerequisites

You need to have [![pnpm](https://img.shields.io/badge/pnpm-F69220?logo=pnpm&logoColor=fff)](https://pnpm.io) installed. For macOS with [![Homebrew](https://img.shields.io/badge/Homebrew-FBB040?logo=homebrew&logoColor=fff)](https://brew.sh/) run the below command
  ```sh
  brew install pnpm
  ```
For other platforms and more details, visit the official site [here](https://pnpm.io/installation#using-other-package-managers)

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/rufus582/dev-utils.git
   ```
2. Install dependencies
   ```sh
   pnpm install
   ```
3. Run the dev server
   ```sh
   pnpm run dev
   ```
4. Visit http://localhost:5173 on your browser to access this web application

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request to the `preview` branch

<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.


<!-- CONTACT -->
## Contact

Rufus Immanuel Raj P - rufus5802@gmail.com

Project Link: [https://github.com/rufus582/dev-utils](https://github.com/rufus582/dev-utils)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/rufus582/dev-utils.svg?style=for-the-badge
[contributors-url]: https://github.com/rufus582/dev-utils/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/rufus582/dev-utils.svg?style=for-the-badge
[forks-url]: https://github.com/rufus582/dev-utils/network/members
[stars-shield]: https://img.shields.io/github/stars/rufus582/dev-utils.svg?style=for-the-badge
[stars-url]: https://github.com/rufus582/dev-utils/stargazers
[issues-shield]: https://img.shields.io/github/issues/rufus582/dev-utils.svg?style=for-the-badge
[issues-url]: https://github.com/rufus582/dev-utils/issues
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/rufus58
[product-screenshot]: docs/screenshot.png
<!-- Shields.io badges. You can a comprehensive list with many more badges at: https://github.com/inttter/md-badges -->
[TailwindCSS]: https://img.shields.io/badge/Tailwind%20CSS-%2338B2AC.svg?logo=tailwind-css&logoColor=white
[TailwindCSS-url]: https://tailwindcss.com/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Vite]: https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=fff
[Vite-url]: https://vite.dev/
