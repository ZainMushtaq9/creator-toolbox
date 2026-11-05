import { Component } from "react";
import { trackEvent } from "../services/analytics.js";

// React error boundary (Phase 2 gap — Roadmap PDF §2.1).
// Catches render errors anywhere below it so one broken tool/page does not
// blank the whole site. Offers a reset (retry) and a way back home.
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    // tool_error: only the page path is sent to analytics — never the
    // error message or stack, which could contain user input.
    trackEvent("tool_error", { page: window.location.pathname });
    // Never send error details to any server. Log locally only.
    console.error("CreatorToolbox error boundary caught:", error, info);
  }
  handleReset = () => this.setState({ hasError: false, error: null });
  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div className="container section" role="alert">
        <h1>Something went wrong</h1>
        <p>
          This part of CreatorToolbox hit an unexpected error. Your work in
          other tools is not affected, and nothing was uploaded.
        </p>
        <p className="notice">
          {this.state.error ? String(this.state.error.message || this.state.error) : "Unknown error"}
        </p>
        <div className="toolbar">
          <button type="button" className="btn" onClick={this.handleReset}>Try again</button>
          <a className="btn secondary" href="/">Go to the homepage</a>
        </div>
      </div>
    );
  }
}
