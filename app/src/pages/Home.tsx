import { css } from "@emotion/react";
import Citation from "@/components/Citation";
import Section from "@/components/Section";
import Flex from "@/components/Flex";

const heroStyle = css({
  fontSize: "20px",
  textAlign: "center",
});

const Home = () => (
  <>
    <Section fill="deep">
      <p css={heroStyle}>
        A lot of scientific and medical writing is hard to understand for
        non-experts because it is full of jargon.
        <br />
        This tool helps you identify complexity in your writing and simplify it.
      </p>
    </Section>

    <Section>
      <Flex dir="col">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis
          varius quam quisque id diam vel quam elementum. Rhoncus dolor purus
          non enim praesent elementum facilisis leo. In fermentum posuere urna
          nec tincidunt praesent semper feugiat nibh. Id donec ultrices
          tincidunt arcu non sodales neque. Tellus elementum sagittis vitae et
          leo duis ut diam. Ut faucibus pulvinar elementum integer enim neque.
          In tellus integer feugiat scelerisque varius morbi enim nunc. Quis
          imperdiet massa tincidunt nunc pulvinar sapien et ligula ullamcorper.
          Amet nulla facilisi morbi tempus iaculis urna id. Pulvinar
          pellentesque habitant morbi tristique senectus et netus et. Bibendum
          enim facilisis gravida neque convallis a cras semper. Enim sit amet
          venenatis urna cursus. Volutpat commodo sed egestas egestas fringilla
          phasellus. Ullamcorper malesuada proin libero nunc consequat interdum
          varius. Dui accumsan sit amet nulla facilisi morbi tempus iaculis.
          Facilisis magna etiam tempor orci eu lobortis elementum nibh tellus.
          Phasellus faucibus scelerisque eleifend donec pretium vulputate sapien
          nec.
        </p>
        <p>
          Justo eget magna fermentum iaculis. Eu ultrices vitae auctor eu.
          Lobortis feugiat vivamus at augue eget arcu dictum. Etiam non quam
          lacus suspendisse. Nulla facilisi etiam dignissim diam quis enim
          lobortis scelerisque. Integer quis auctor elit sed. Vel quam elementum
          pulvinar etiam non quam. Ornare suspendisse sed nisi lacus sed
          viverra. Justo donec enim diam vulputate ut pharetra. Tellus molestie
          nunc non blandit. Porta non pulvinar neque laoreet suspendisse
          interdum. Urna duis convallis convallis tellus id interdum velit
          laoreet. Aliquam purus sit amet luctus. Nisi quis eleifend quam
          adipiscing vitae proin. Platea dictumst vestibulum rhoncus est
          pellentesque elit.
        </p>
        <p>
          Lectus quam id leo in vitae turpis massa sed elementum. Nunc vel risus
          commodo viverra maecenas accumsan lacus vel. Egestas dui id ornare
          arcu odio ut sem nulla pharetra. Quisque non tellus orci ac auctor
          augue mauris augue. Feugiat in fermentum posuere urna nec tincidunt
          praesent. Consectetur lorem donec massa sapien faucibus. Varius vel
          pharetra vel turpis nunc eget lorem dolor sed. Commodo viverra
          maecenas accumsan lacus vel facilisis. Sit amet commodo nulla facilisi
          nullam vehicula. Neque aliquam vestibulum morbi blandit cursus risus
          at ultrices mi. Ac odio tempor orci dapibus ultrices in iaculis.
          Dapibus ultrices in iaculis nunc sed. Volutpat est velit egestas dui
          id. Vestibulum mattis ullamcorper velit sed ullamcorper morbi. Purus
          in mollis nunc sed id semper risus in. Est pellentesque elit
          ullamcorper dignissim.
        </p>
      </Flex>
    </Section>

    <Section fill="dark">
      <Citation />
    </Section>
  </>
);

export default Home;
