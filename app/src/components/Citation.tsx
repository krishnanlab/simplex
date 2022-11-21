/** how to cite app instructions */
const Citation = () => (
  <p>
    <strong>
      Simplex, a tool for writing and sharing complex ideas in science using
      simple words
    </strong>
    <br />
    C. Youn, J. Shah, M. Artuso, A. Yannakopoulos, N. Hawkins, J. Zubek, A.
    Krishnan
    <br />
    URL: <a href={import.meta.env.VITE_URL}>{import.meta.env.VITE_URL}</a>
  </p>
);

export default Citation;
