import Citation from "@/components/Citation";
import Section from "@/components/Section";
import { Link } from "react-router-dom";

const About = () => (
  <>
    <Section>
      <h2>About</h2>
      <p>
        <strong>
          Simplex is an online app for writing complex ideas using simple words.
        </strong>{" "}
        Its main component is a feature-rich text editor that highlights
        difficult words and offers insights and alternatives in real time,
        allowing a human writer to simplify dense technical text.
      </p>
      <p>
        Simplex also allows users to organize and manage their content. With an
        account, you can save articles for later revision and group articles
        into collections. Individual articles and collections can be shared via
        a link with a click of a button.
      </p>

      <hr />

      <h3 id="benefits">What are the benefits?</h3>
      <p>Simplex can be used to:</p>
      <ul>
        <li>
          Make abstracts of published papers and conference proceedings more
          broadly accessible.
        </li>
        <li>
          Increase the awareness and use of research within the scientific and
          medical communities.
        </li>
        <li>
          Effectively convey research and technical feats back to funders and
          stakeholders.
        </li>
        <li>
          Strengthen communication skills and conceptual understanding of
          students/trainees.
        </li>
      </ul>
      <p>
        <strong>For authors...</strong>
        <br />
        Professionals and students in science and medicine can use Simplex to
        write technical content in accessible language, save and revise it, then
        easily share it with anyone.
      </p>
      <p>
        <strong>For facilitators...</strong>
        <br />
        Funders, societies, publishers, and educators can facilitate effective
        scientific and medical communication by encouraging professionals and
        students to use Simplex. Simplex has built-in features that facilitators
        can use to easily track, organize, and manage documents.
      </p>
      <p>
        <strong>For readers...</strong>
        <br />
        Professional communicators (e.g. journalists) and the general public can
        use Simplex to access science and medical content in simpler language.
        We are building features for searching technical content using search
        queries in simple language.
      </p>

      <hr />

      <h3 id="faqs">Frequently Asked Questions</h3>
      <h4>Why did we build Simplex?</h4>
      <p>
        Jargon and technical language stand in the way of understanding most
        forms of scientific and medical communications like reports, abstracts,
        papers, and books. This is a challenge not just for “laymen”, but even
        for experts in adjacent fields. This understandability barrier leads to
        problems with scientific and medical transparency, accessibility, and
        trust. Mistaking hard-to-understand language for hard-to-understand
        ideas also creates artificial hurdles for students (and anyone else)
        entering into science and medicine. Finally, as one needs to know the
        technical terms to even search and find relevant information, jargon is
        also an obstacle for retrieving knowledge. Our goal is to develop
        techniques and tools to help address these challenges. Simplex is a step
        in that direction.
      </p>
      <h4>How does Simplex quantify how understandable a word is?</h4>
      <p>
        Sorry, this gets a bit technical. We have developed a new measure that
        quantifies a word’s likely understandability. To develop this measure,
        we used Wikipedia articles and their category tags to capture how
        individual words are used across articles in various categories. Then,
        for each word, we calculated the uniformity of its usage across
        categories and combined it with that word’s overall frequency to get a
        single word complexity score. We also repurposed this procedure to
        develop a novel method to automatically identify basic terminology
        specific to a scientific field. This field-specific complexity score
        combines two quantities – 1) how non-uniform a word across different
        fields of science, and 2) how common it is in a specific field – into a
        single score. Combining both of these word lists creates a dictionary of
        basic English and elementary scientific terminology with a very
        adaptable method that can be applied to nearly any scientific field,
        without requiring any manual curation of a word list.
      </p>
      <h4>
        Aren’t there existing methods for measuring how difficult a particular
        piece of text is?
      </h4>
      <p>
        Yes are, but they have multiple issues. Let’s begin with one of the most
        used approaches to improve the readability of text. There have been many
        readability scores created with the intention of capturing a succinct
        measure of a given text's ease of understanding. The most well-known and
        widely used of these is the Flesch-Kincaid (FK) grade level score. The
        FK score is the weighted addition of 1) the average number of words per
        sentence, and 2) the average number of syllables per word. This score,
        or its variants, are used in tools like Microsoft Word or Grammarly. FK
        and its related readability formulae have the same issue: they only
        measure syntactic (or structural) complexity, but fail to account for
        semantic complexity of the passage or its usage in contemporary writing.
        There is no penalty for using more complex terminology so long as the
        number of syllables remains constant. Some readability formulas, such as
        the New Dale-Chall readability formula, introduced the concept of
        difficult words by using a predefined word list (the New Dale-Chall is
        computed with a list of 3,000 “familiar words”). For example, Simple
        Wikipedia is based on restricting the vocabulary to a set of predefined
        ~1,500 simple words. Yet, the usage of a predefined list of simple words
        introduces its own challenges. The selection of terms in the word list
        is largely unquantified, and cannot be easily altered to accommodate a
        target audience or evolving contemporary language.
      </p>

      <hr />

      <h3 id="contact">Contact</h3>
      <p>
        Simplex was built by a team of researchers in the{" "}
        <a href="https://www.thekrishnanlab.org/">Krishnan Lab</a>. If you have
        questions, issues, or would like to collaborate with us, please reach
        out to us on the{" "}
        <a href="https://github.com/krishnanlab">Krishnan Lab Github org</a>, or
        write directly to <a href="mailto:arjun@msu.edu">Arjun Krishnan</a>.
      </p>

      <h3 id="newsletter">Newsletter</h3>
      <p>
        To get updates on Simplex, you can{" "}
        <Link to="/login">sign up for an account</Link> (or{" "}
        <Link to="/login">log in</Link> if you already have one) and{" "}
        <strong>
          enable “Subscribe to our newsletter” in your profile settings
        </strong>
        . Don’t worry: we won’t share your names/email with any outside party
        and we won’t spam you. You can expect high-quality, infrequent, and
        concise messages from us.
      </p>

      <h3 id="cite">How to cite Simplex</h3>
      <Citation />
    </Section>
  </>
);

export default About;
