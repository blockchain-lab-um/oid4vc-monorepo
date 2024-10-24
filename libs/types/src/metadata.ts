import type {
  SupportedCredentialFormats,
  SupportedPresentationFormats,
} from './credential.js';
import type { OAuth2ClientMetadata } from './oauth2.js';

/**
 * OpenID Provider (OP) Metadata
 *
 * Specs:
 * - https://openid.net/specs/openid-4-verifiable-credential-issuance-1_0-11.html#section-10.2.3
 */
export interface IssuerServerMetadata {
  /**
   * The Credential Issuer's identifier.
   */
  credential_issuer: string;

  /**
   * Identifier of the OAuth 2.0 Authorization Server (as defined in [RFC8414]) the
   * Credential Issuer relies on for authorization. If this element is omitted, the entity
   * providing the Credential Issuer is also acting as the AS, i.e. the Credential Issuer's
   * identifier is used as the OAuth 2.0 Issuer value to obtain the Authorization Server metadata
   * as per [RFC8414].
   */
  authorization_server?: string;

  /**
   * URL of the Credential Issuer's Credential Endpoint. This URL MUST use the https scheme and MAY
   * contain port, path and query parameter components.
   */
  credential_endpoint: string;

  /**
   * URL of the Credential Issuer's Deferred Credential Endpoint. This URL MUST use the https
   * scheme and MAY contain port, path and query parameter components.
   */
  deferred_credential_endpoint: string;

  /**
   * A JSON array containing a list of JSON objects, each of them representing metadata about a
   * separate credential type that the Credential Issuer can issue. The JSON objects in the array
   * MUST conform to the structure of the Section 10.2.3.1.
   *
   * @see https://openid.net/specs/openid-4-verifiable-credential-issuance-1_0-11.html#section-10.2.3.1
   */
  credentials_supported: SupportedCredential[];
}

export interface OPMetadata {
  /**
   * REQUIRED. URL using the `https` scheme with no query or fragment component that the OP asserts
   * as its Issuer Identifier. If Issuer discovery is supported, this value MUST be identical to
   * the issuer value returned by WebFinger. This also MUST be identical to the `iss` Claim value
   * in ID Tokens issued from this Issuer.
   */
  issuer: string;

  /**
   * REQUIRED. URL of the OP's OAuth 2.0 Authorization Endpoint.
   */
  authorization_endpoint: string;

  /**
   * URL of the OP's OAuth 2.0 Token Endpoint. This is REQUIRED unless only the Implicit Flow is
   * used.
   */
  token_endpoint: string;

  /**
   * The URL of the presentation definition endpoint at which the client can get the presentation
   * definition requirements.
   *
   * Non-standard (yet). Used in EBSI.
   */
  presentation_definition_endpoint?: string;

  /**
   * REQUIRED. URL of the OP's JSON Web Key Set document. This contains the signing key(s) the RP
   * uses to validate signatures from the OP. The JWK Set MAY also contain the Server's encryption
   * key(s), which are used by RPs to encrypt requests to the Server. When both signing and
   * encryption keys are made available, a `use` (Key Use) parameter value is REQUIRED for all keys
   * in the referenced JWK Set to indicate each key's intended usage. Although some algorithms
   * allow the same key to be used for both signatures and encryption, doing so is NOT RECOMMENDED,
   * as it is less secure. The JWK x5c parameter MAY be used to provide X.509 representations of
   * keys provided. When used, the bare key values MUST still be present and MUST match those in
   * the certificate.
   */
  jwks_uri: string;

  /**
   * RECOMMENDED. JSON array containing a list of the OAuth 2.0 scope values that this server
   * supports. The server MUST support the `openid` scope value. Servers MAY choose not to advertise
   * some supported scope values even when this parameter is used, although those defined in
   * OpenID.Core SHOULD be listed, if supported.
   */
  scopes_supported?: ['openid'];

  /**
   * REQUIRED. JSON array containing a list of the OAuth 2.0 `response_type` values that this OP
   * supports. Dynamic OpenID Providers MUST support the `code`, `id_token`, and the
   * `token id_token` Response Type values.
   */
  response_types_supported: string[];

  /**
   * OPTIONAL. JSON array containing a list of the OAuth 2.0 `response_mode` values that this OP
   * supports, as specified in OAuth 2.0 Multiple Response Type Encoding Practices. If omitted, the
   * default for Dynamic OpenID Providers is `["query", "fragment"]`.
   */
  response_modes_supported?: string[];

  /**
   * OPTIONAL. JSON array containing a list of the OAuth 2.0 Grant Type values that this OP
   * supports. Dynamic OpenID Providers MUST support the authorization_code and implicit Grant Type
   * values and MAY support other Grant Types. If omitted, the default value is `["authorization_code", "implicit"]`.
   */
  grant_types_supported?: string[];

  /**
   * REQUIRED. JSON array containing a list of the Subject Identifier types that this OP supports.
   * Valid types include `pairwise` and `public`.
   */
  subject_types_supported: ('pairwise' | 'public')[];

  /**
   * REQUIRED. JSON array containing a list of the JWS signing algorithms (alg values) supported by
   * the OP for the ID Token to encode the Claims in a JWT [JWT]. The algorithm `RS256` MUST be
   * included. The value `none` MAY be supported, but MUST NOT be used unless the Response Type
   * used returns no ID Token from the Authorization Endpoint (such as when using the
   * Authorization Code Flow).
   */
  id_token_signing_alg_values_supported: string[];

  /**
   * OPTIONAL. JSON array containing a list of the JWS signing algorithms (alg values) supported by
   * the OP for Request Objects, which are described in Section 6.1 of OpenID Connect Core 1.0.
   * These algorithms are used both when the Request Object is passed by value (using the request
   * parameter) and when it is passed by reference (using the request_uri parameter). Servers
   * SHOULD support `none` and `RS256`.
   */
  request_object_signing_alg_values_supported?: string[];

  /**
   * OPTIONAL. Boolean value specifying whether the OP supports use of the request parameter, with
   * true indicating support. If omitted, the default value is `false`.
   */
  request_parameter_supported?: boolean;

  /**
   * OPTIONAL. Boolean value specifying whether the OP supports use of the request_uri parameter,
   * with true indicating support. If omitted, the default value is `true`.
   */
  request_uri_parameter_supported?: boolean;

  /**
   * An object containing a list of key value pairs, where the key is a string identifying a
   * credential format supported by the AS.
   *
   * @see https://openid.net/specs/openid-4-verifiable-presentations-1_0-14.html#name-additional-authorization-se
   */
  vp_formats_supported?: Partial<
    Record<
      'jwt_vc' | 'jwt_vp' | 'jwt_vc_json' | 'jwt_vp_json',
      {
        /**
         * An object where the value is an array of case sensitive strings that identify the
         * cryptographic suites that are supported. Cryptosuites for Credentials in jwt_vc format
         * should use algorithm names defined in [IANA JOSE Algorithms Registry](https://www.iana.org/assignments/jose/jose.xhtml#web-signature-encryption-algorithms).
         */
        alg_values_supported: string[];
      }
    >
  >;

  /**
   * REQUIRED. A JSON array of strings representing URI scheme identifiers and optionally method
   * names of supported Subject Syntax Types. When Subject Syntax Type is JWK Thumbprint, valid
   * value is `urn:ietf:params:oauth:jwk-thumbprint` defined in RFC9278. When Subject Syntax Type
   * is Decentralized Identifier, valid values MUST be a `did:` prefix followed by a supported DID
   * method without a `:` suffix. For example, support for the DID method with a method-name
   * "example" would be represented by `did:example`. Support for all DID methods is indicated by
   * sending did without any method-name.
   */
  subject_syntax_types_supported: string[];

  /**
   * Non-standard. Used in EBSI.
   */
  subject_syntax_types_discriminations: string[];

  /**
   * REQUIRED. Array of Redirection URI values used by the Client. One of these registered
   * Redirection URI values MUST exactly match the redirect_uri parameter value used in each
   * Authorization Request, with the matching performed as described in Section 6.2.1 of [RFC3986]
   *
   * Since the AS is acting as a client for the ID Token Request/Response, we're adding request_uris
   * claim as defined in OIDC Dynamic Client Registration.
   *
   * @see https://openid.net/specs/openid-connect-registration-1_0.html#ClientMetadata
   */
  redirect_uris: string[];

  /**
   * JSON array containing a list of client authentication methods supported by this token
   * endpoint.  Client authentication method values are used in the "token_endpoint_auth_method"
   * parameter defined in Section 2 of [RFC7591].
   *
   * @see https://www.rfc-editor.org/rfc/rfc8414.html#section-2
   *
   * MUST contain "private_key_jwt"
   */
  token_endpoint_auth_methods_supported: string[];

  /**
   * OPTIONAL. A JSON Object defining the client authentications supported for each endpoint. The
   * endpoint names are defined in the IANA "OAuth Authorization Server Metadata" registry [IANA.OAuth.Parameters].
   * Other endpoints and authentication methods are possible if made recognizable according to
   * established standards and not in conflict with the operating principles of this specification.
   * In OpenID Connect Core, no client authentication is performed at the authentication endpoint.
   * Instead, because the request itself is authenticated. What it amounts to is that the OP maps
   * information in the request (like the redirect_uri) to information it has gained on the client
   * through static or dynamic registration. If the map is successful, the request can be processed.
   * If the RP uses Automatic Registration, as defined in Section 10.1, the OP has no prior
   * knowledge of the RP. Therefore, the OP must start by gathering information about the RP using
   * the process outlined in Section 6. Once it has the RP's metadata, the OP can verify the
   * request in the same way as if it had known the RP's metadata beforehand. To make the request
   * verification more secure, we demand the use of a client authentication or verification method
   * that proves that the RP is in possession of a key that appears in the RP's metadata.
   *
   * @see https://openid.net/specs/openid-connect-federation-1_0.html#name-op-metadata
   */
  request_authentication_methods_supported?: {
    authorization_endpoint?: string[];
  };

  /**
   * REQUIRED. A JSON array of supported trust frameworks.
   *
   * MUST contain: 'ebsi'
   */
  subject_trust_frameworks_supported: string[];

  /**
   * OPTIONAL. A JSON array of strings containing the list of ID Token types supported by the OP,
   * the default value is attester_signed_id_token. The ID Token types defined in this
   * specification are:
   * - subject_signed_id_token: Self-Issued ID Token, i.e. the id token is signed with key material
   *   under the end-user's control.
   * - attester_signed_id_token: the id token is issued by the party operating the OP, i.e. this is
   *   the classical id token as defined in [OpenID.Core].
   *
   * MUST contain subject_signed_id_token
   */
  id_token_types_supported: string[];
}

/**
 * Verifier Server Metadata
 *
 * SPECS:
 * - https://openid.net/specs/openid-4-verifiable-presentations-1_0.html#section-9
 * - https://openid.bitbucket.io/connect/openid-connect-self-issued-v2-1_0.html#section-7.5
 *
 * EXTRAS:
 * - https://openid.net/specs/openid-connect-registration-1_0.html#ClientMetadata
 */
export interface VerifierServerMetadata extends OAuth2ClientMetadata {
  vp_formats: (SupportedCredentialFormats | SupportedPresentationFormats)[];
  subject_syntax_types_supported: string[];
}

/**
 * Supported Credential
 *
 * Specs:
 * - https://openid.net/specs/openid-4-verifiable-credential-issuance-1_0.html#section-10.2.3.1
 *
 * cryptographic_binding_methods_supported: ['cose_key', 'jwk', 'did', 'did:{method}']
 */
export type SupportedCredential = {
  id?: string;
  cryptographic_binding_methods_supported?: string[];
  cryptographic_suites_supported?: string[];
  display?: CredentialDisplay[];
  order?: string[];
  credentialSchema: CredentialSchema; // Not in specs
} & (
  | SupportedCredentialJwtVcJson
  | SupportedCredentialJwtVcJsonLd
  | SupportedCredentialMsoMdoc
);

export interface SupportedCredentialJwtVcJson {
  format: 'jwt_vc_json';
  types: string[];
  credentialSubject?: any;
}

export interface SupportedCredentialJwtVcJsonLd {
  format: 'jwt_vc_json-ld' | 'ldp_vc';
  types: string[];
  '@context': string[];
  credentialSubject?: any;
}

export interface SupportedCredentialMsoMdoc {
  format: 'mso_mdoc';
  doctype: string;
  claims?: any;
}

export interface CredentialSchema {
  id: string;
  type: string;
}

/**
 * Credential Display
 *
 * SPECS:
 * - #TODO
 */
interface CredentialDisplay {
  name: string;
  locale?: string;
  logo?: Logo;
  background_color?: string;
  text_color?: string;
}

/**
 * Logo
 *
 * SPECS:
 * - #TODO
 */
interface Logo {
  url?: string;
  alt_text?: string;
}
