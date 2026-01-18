"use client";

import { Divider } from "antd";

const titleStyle: React.CSSProperties = {
  fontSize: "26px",
  fontWeight: "bold",
};

const contentStyle: React.CSSProperties = {
  color: "#444",
  fontSize: "18px",
  lineHeight: "1.45em",
  paddingBottom: "5vh",
};

export default function PrivacyPolicyPage() {
  return (
    <section style={{ padding: "3vw 15vh", textAlign: "left" }}>
      <div
        style={{
          fontSize: "56px",
          paddingBottom: "0.1em",
        }}
      >
        Cookies Policy
      </div>
      <Divider />
      <p
        style={{
          color: "#444",
          fontSize: "18px",
          lineHeight: "1.45em",
          padding: "1.6vh 0 2.5vh 0",
        }}
      >
        YuGuang issues this privacy policy as its commitment on protecting the
        privacy of every individual or company. This statement outlines the
        policy to protect the personal information you provide us when visiting
        the Site.
      </p>
      <div style={titleStyle}>Information Collection</div>
      <p style={contentStyle}>
        We may require you to provide individual identifiable and background
        information for the convenience of your visiting or for providing you
        services after visiting the Site. You reserve the right of offering your
        confidential data to the Site. And if you do not want your confidential
        data collected, please do not submit it to us. We may collect the domain
        names, not the e-mail addresses, of visitors and we also seek to place a
        &quot;cookie&quot; on your computer&apos;s hard drive which allows the server to
        determine the computer when it visits again, in order to track
        statistical information about navigation to and throughout certain areas
        of our site. This is used to help us improve our site navigation and to
        measure the effectiveness of our overall website experience.
      </p>
      <div style={titleStyle}>Information Use</div>
      <p style={contentStyle}>
        Providing us with your personal information makes it easier for us to
        make our website relevant to you, communicate with you, assist you in
        making a purchase of our products, and allow you access to certain
        limited-entry areas of our site.The personal information you provide us
        may be stored and processed in which we or any affiliates conduct
        operations. By submitting such information, you consent to the transfer
        of such information outside your home country.
      </p>
      <div style={titleStyle}>Information Security</div>
      <p style={contentStyle}>
        The site will strictly manage and protect the personal data you offer to
        us. And your personal information will be kept confidential unless you
        clearly state in the relevant part of the Site that you agree to expose
        one or some parts of your personal information. Any information about
        you will not be exposed or sold to the third party. Except the
        confidential data explicitly stated, any other information you provide
        to the Site, including problems, suggestions, opinions or the like will
        not be regarded as confidential.
      </p>
      <div style={titleStyle}>Links to Other Sites</div>
      <p style={contentStyle}>
        YuGuang&apos;s website contains links to other sites, and we are not
        responsible for the information collection or privacy practices, or the
        content on those sites.
      </p>
      <div style={titleStyle}>Changes to this Policy</div>
      <p style={contentStyle}>
        Please check this privacy policy periodically to inform yourself of any
        changes.
      </p>
    </section>
  );
}
