"use client";

import Head from "next/head";
import React, { useEffect, useState, useRef } from "react";
import Navbar from "../../components/sales/Navbar/Navbar";
import Footer from "../../components/sales/Footer/Footer";
import Contact_Form from "../../components/sales/Contact_Form/Contact_Form";
import "../CSS/styles.css";
import "./privacy-policy.css";
import Link from "next/link";

const Page = () => {
  const [isFormOpen, setFormOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(
      /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
        navigator.userAgent
      ) || window.innerWidth <= 767
    );
  }, []);

  const handleContactClick = () => {
    if (isMobile) {
      window.open(
        "https://api.whatsapp.com/send/?phone=9326780323&text&type=phone_number&app_absent=0",
        "_blank"
      );
    } else {
      setFormOpen(true);
    }
  };

  const formRef = useRef();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 767);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleButtonClick = () => {
    if (isMobile) {
      window.open(
        "https://api.whatsapp.com/send/?phone=9920934198&text&type=phone_number&app_absent=0",
        "_blank"
      );
    } else {
      formRef.current?.openForm();
    }
  };
  return (
    <>
      <Head>
        <title>Privacy Policy | Ekyamm</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="icon"
          href="/images/logo-circle-hands.svg"
          type="image/png"
        />
      </Head>

      <Navbar onStartClick={handleButtonClick} />

      {isFormOpen && (
        <div
          className="overlay"
          onClick={() => setFormOpen(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.8)",
            zIndex: 11,
          }}
        ></div>
      )}
      <div class="overlay"></div>
      <section id="header-section" className="text-center my-4">
        <h1>Privacy Policy</h1>
        <span
          style={{
            display: "inline-block",
            width: "86px",
            border: "5px solid rgba(204, 98, 123, 1)",
            borderRadius: "50px",
            marginBottom: "18px",
          }}
        ></span>
        <p>Last Update: May 01, 2025</p>
      </section>

      <section
        id="content"
        className="mx-2 lg:mx-12 px-2 lg:px-12 pb-5 lg:pb-12"
      >
        <p>
          This Privacy Policy (“Policy”) describes how Ekyamm / Radicle Minds
          India Private Limited (“Ekyamm,” “we,” “our,” “us”) collects, uses,
          and discloses certain personal information obtained through our
          website (“Site”), which is located at www.ekyamm.com and its
          subdomains and our mobile device application (“App”). By visiting our
          Site, downloading our App, and/or using the features made available to
          you on the Site and the App (the “Services”), you are agreeing to the
          terms of this Policy. <br />
          This Policy applies only to information collected through the Site and
          the App and therefore does not apply to data we collect in other
          contexts. <br />
          What Information We Collect and Maintain About You <br />
          We collect personal and other information from you directly when you
          provide it to us through the Site and the App. <br />
          We may also automatically collect certain information about you when
          you and your mobile or other such device use, access, or interact with
          our Services.
        </p>
        <br />

        <h1>Personal information you provide.</h1>
        <p>
          You can visit the Site without submitting any information that we can
          use to identify you personally. However, if you use certain features
          on the Site, such as the “Contact Us” or `&quot;Chat`&quot; or
          `&quot;Request Invite`&quot; or &quot;Demo`&quot; feature, you will be
          required to provide personal information. Such information could
          include, for example, your name, clinic name, email address, or phone
          number. <br />
          When you register with us and use the App, you may provide your name,
          email address, age, password and other registration information,
          transaction-related information, and information you provide when you
          contact us via the App.
        </p>
        <br />

        <h1>User content.</h1>
        <p>
          It is possible for you to submit your own content, such as answers to
          journal entries, other writings, or guided questions, in all cases
          submitted in the App. Ekyamm does not read or access any of your
          private user content which is secure and decrypted using the 4-digit
          pin that you create. Such content is encrypted and stored locally on
          your device or in the cloud.
        </p>
        <br />

        <h1>Mental health information.</h1>
        <p>
          Because of the nature of the Services, we will be collecting
          information about your patients that relates to their mental health.
          Such information may include reflections on your assessment of the
          patient, information about current mental state or mood, information
          on symptoms of mental health conditions, previous diagnoses, patient
          history, and additional personal information related to answers
          provided to guided questions. Such information is only collected when
          you provide it to us. We do not share this information with third
          parties and only use this to give you access to the relevant patient
          details.
        </p>
        <br />

        <h1>Cookies.</h1>
        <p>
          The Site contains cookies. Cookies are small files that are stored on
          your computer by your web browser. First-party cookies are cookies set
          by our Services. Third-party cookies are cookies set by external
          services such as Facebook. Our Site uses first-party and third-party
          cookies. A cookie allows a website to recognize whether you have
          visited before and may store user preferences and other information.
          For example, cookies can be used to collect or store information about
          your use of the Site during your current session and over time
          (including the pages you view and the files you download), your
          computer’s operating system and browser type, your Internet service
          provider, your domain name and IP address, your general geographic
          location, the website that you visited before the Site, and the link
          that you used to leave the Site. If you are concerned about having
          cookies on your computer, you can set your browser to refuse all
          cookies or to indicate when a cookie is being set, allowing you to
          decide whether to accept it. You can also delete cookies from your
          computer by clearing the browsing history of your browser. However, if
          you choose to block or delete cookies, certain features of the Site
          may not operate correctly.
        </p>
        <br />

        <h1>SDKs and mobile advertising IDs.</h1>
        <p>
          Our Services includes third-party software development kits (“SDKs”)
          that allow us and our service providers to collect information about
          your activity. In addition, some mobile devices come with a resettable
          advertising ID (such as Apple’s IDFA and Google’s Advertising ID)
          that, like cookies and pixel tags, allow us and our service providers
          to identify your mobile device over time for advertising purposes.
        </p>
        <br />

        <h1>Third-party online tracking.</h1>
        <p>
          We also may partner with certain third parties to collect, analyze,
          and use some of the personal and other information described in this
          section. For example, we may allow third parties to set cookies or use
          web beacons on the Site or in email communications from us. This
          information may be used for a variety of purposes, including online
          website analytics.
        </p>
        <br />

        <h1>Aggregated and de identified information.</h1>
        <p>
          From time to time, we may also collect aggregated or de identified
          information about Site users for internal use to improve the product.
          Such aggregated or de identified information will not identify you
          personally.
        </p>
        <br />

        <h1>How We Use Your Information.</h1>
        <p>
          We use the information that we collect for a variety of purposes in
          the interest of consistently delivering the best and most personalized
          mental health services. These purposes include, for example:
        </p>
        <ul className="my-[10px]">
          <li>To provide the Services;</li>
          <li>
            To respond to your questions or requests concerning the Site, App,
            or other services offered by us;
          </li>
          <li>To fulfill the terms of any agreement you have with us;</li>
          <li>
            To fulfill your requests for our Services or otherwise complete a
            transaction that you initiate, including in-App and Site purchases;
          </li>
          <li>
            To send you information about our Services and other topics that are
            likely to be of interest to you, including through emails from which
            you may opt-out;
          </li>
          <li>
            To deliver confirmations, account information, notifications, and
            similar operational communications;
          </li>
          <li>
            To improve your user experience and the quality of our products and
            Services;
          </li>
          <li>To comply with legal and/or regulatory requirements; and</li>
          <li>To manage our business.</li>
        </ul>
        <p>
          In addition to the purposes above, we use the information that we
          collect automatically through the Site and the App for such purposes
          as:
        </p>
        <ul className="my-[10px]">
          <li>
            Counting and recognizing visitors to the Site and users of the App;
          </li>
          <li>
            Analyzing how visitors use the Site and various Site features;
          </li>
          <li>Analyzing how users of the App use the App and App features;</li>
          <li>
            Improving the Site and App and enhancing users’ experiences with the
            Site and the App;
          </li>
          <li>
            Creating new products and services or improving our existing
            products and Services;
          </li>
          <li>
            Enabling additional website analytics and research concerning the
            Site and the App; and
          </li>
          <li>Engaging in interest-based advertising (as described below).</li>
        </ul>
        <p className="mt-[10px]">
          We may link information gathered through the Site or the App with
          information that we collect in other contexts. But in that event, we
          will handle the combined information in a manner consistent with this
          Policy.
        </p>
        <br />

        <h1>With Whom and Why We Share Your Information.</h1>
        <br />
        <ul>
          <li>
            <h2>Analytics</h2>
          </li>
        </ul>
        <p className="mt-[10px]">
          We may partner with certain third parties to obtain the automatically
          collected information discussed above and to engage in analysis,
          auditing, research, and reporting. These third parties may use web
          logs or web beacons, and they may set and access cookies on your
          computer or other device. In particular, the Site uses Google
          Analytics to help collect and analyze certain information for the
          purposes discussed above. You may opt out of the use of cookies by
          Google Analytics here.
          <br /> We would not be using any of your personal or patient
          information that has been store in your private notes or journaling.
        </p>
        <br />
        <ul>
          <li>
            <h2>With third-party service providers.</h2>
          </li>
        </ul>
        <p className="mt-[10px]">
          To provide the best experience to you, our user, Ekyamm may use
          third-party service providers that perform services on our behalf,
          including web-hosting companies, application development platforms,
          database as a service providers, payment systems, advertising
          platforms, mailing vendors, and analytics providers. These service
          providers may collect and/or use your information, including
          information that identifies you personally, to assist us in achieving
          the purposes discussed above.
          <br /> We may share your information with other third parties when
          necessary to fulfill your requests for Services; to complete a
          transaction that you initiate; to meet the terms of any agreement that
          you have with us or our partners; or to manage our business.
        </p>
        <br />
        <ul>
          <li>
            <h2>Interest-based advertising.</h2>
          </li>
        </ul>
        <p className="mt-[10px]">
          The Services also enable third-party tracking mechanisms to collect
          information about you and your computing devices for use in online
          interest-based advertising. For example, third parties, such as
          Facebook, may use the fact that you visited our Site or App to target
          online ads to you about our Services. In addition, our third-party
          advertising networks might use information about your use of our
          Services to help target advertisements based on your mobile activity
          in general.
          <br /> The use of online tracking mechanisms by third parties is
          subject to those third parties’ own privacy policies, and not this
          Policy. If you prefer to prevent third parties from setting and
          accessing cookies on your computer or other device, you may set your
          browser to block cookies. Additionally, you may remove yourself from
          the targeted advertising of companies within the Network Advertising
          Initiative by opting out, or of companies participating in the Digital
          Advertising Alliance by opting out. Although our Services currently do
          not respond to “do not track” browser headers, you can limit tracking
          through these third-party programs and by taking the other steps
          discussed above. <br /> If you use the Services through your mobile
          device, you may also opt-out of interest-based by adjusting the
          advertising preferences on your mobile device. You may further opt out
          for companies that participate in the Digital Advertising
          Alliance&apos;s AppChoices tool by downloading it and following the
          instructions on the website.
        </p>
        <br />
        <ul>
          <li>
            <h2>For Legal Purposes.</h2>
          </li>
        </ul>
        <p className="mt-[10px]">
          We also may use or share your information with third parties when we
          believe, in our sole discretion, that doing so is necessary:
          <br /> To comply with applicable law or a court order, subpoena, or
          other legal process; <br />
          To investigate, prevent, or take action regarding illegal activities,
          suspected fraud, violations of our terms and conditions, or situations
          involving threats to our property or the property or physical safety
          of any person or third party; <br />
          To establish, protect, or exercise our legal rights or defend against
          legal claims; or <br />
          To facilitate the financing, securitization, insuring, sale,
          assignment, bankruptcy, or other disposal of all or part of our
          business or assets. You will be notified via email or a notice on our
          website of any change in ownership or uses of this information, as
          well as any choices you may have regarding this information. <br />
          We never sell your information.
          <br /> The App allows you to share collected data with your patients
          or practitioner, but only with your permission.
        </p>
        <br />
        <h1>Data Retention and Storage.</h1>
        <p className="mt-[10px]">
          We retain personal information about you necessary to fulfill the
          purpose for which that information was collected or as required or
          permitted by law. We do not retain personal information longer than is
          necessary for us to achieve the purposes for which you stored it,
          which includes the time period during which you are using the App and
          a reasonable time thereafter. We will retain automatically-collected
          information for up to 24 months and thereafter may store it in the
          aggregate as anonymized data. When we destroy your personal
          information, we do so in a way that prevents that information from
          being restored or reconstructed. .
          <br />
          We store your data in the cloud and on India servers. If you would
          like to delete the personal data that you have provided or uploaded or
          created on Ekyamm platform{" "}
          <Link
            href="/request-account-delete"
            className="text-[#0d6efd] font-[400]"
          >
            click here
          </Link>
          .
        </p>
        <br />

        <h1>Third-party online tracking.</h1>
        <p className="mt-[10px]">
          We also may partner with certain third parties to collect, analyze,
          and use some of the personal and other information described in this
          section. For example, we may allow third parties to set cookies or use
          web beacons on the Site or in email communications from us. This
          information may be used for a variety of purposes, including online
          website analytics.
        </p>
        <br />

        <h1>Data Subject Rights.</h1>
        <p>You have the right to:</p>
        <ul className="my-[10px]">
          <li>access personal data we hold about you;</li>
          <li>request rectification or erasure of your personal data;</li>
          <li>
            request the restriction the of processing of your personal data;
          </li>
          <li>object to the processing of your personal data; and</li>
          <li>data portability</li>
        </ul>
        <p>
          If we have requested your consent, you may withdraw such consent at
          any time.
        </p>
        <p className="mt-[10px]">
          If you would like to exercise any of your data subject rights under
          the GDPR, including by withdrawing your consent, please contact us
          from the Chat section in the Ekyamm app - Open the Ekyamm App, Click
          on the Menu Icon (Hamburger Menu) on the bottom of the expanded Menu
          you will see Ekyamm logo and below it click on the Chat icon. You can
          communicate your wish to us and we shall be in touch with you in a
          reasonable time.
        </p>
        <br />
        <h1>Changes to this Policy.</h1>
        <p>
          We may make changes to the Site and the App in the future and as a
          consequence will need to revise this Policy to reflect those changes.
          We will post all such changes on the Site, in the linked policy on the
          AppStore, in the App under “Settings” and on our Site. You should
          review this page periodically. If we make a material change to the
          Policy, you will be provided with appropriate notice.
        </p>
        <br />

        <h1>How to Contact Us.</h1>
        <p>
          For the purpose of this Policy, Ekyamm is a data storage and
          aggregator for clinics - wherein the clinic has control over private
          notes and data of their patients. <br />
          Should you have any questions or concerns about this Policy, you can
          contact us from the Chat section in the Ekyamm app - Open the Ekyamm
          App, Click on the Menu Icon (Hamburger Menu) on the bottom of the
          expanded Menu you will see Ekyamm logo and below it click on the Chat
          icon. You can communicate your wish to us and we shall be in touch
          with you in a reasonable time.
        </p>
      </section>
      <Footer />

      <div id="contact-form-placeholder" className="m-0">
        <Contact_Form ref={formRef} />
      </div>
    </>
  );
};

export default Page;
