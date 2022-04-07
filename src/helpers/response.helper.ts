export class ResponseHandler {
  static successResponse(data) {
    return JSON.parse(
      JSON.stringify({
        success: true,
        error: null,
        data: data,
      }),
    );
  }

  static errorResponse(error) {
    return JSON.parse(
      JSON.stringify({
        success: false,
        error: error,
        data: null,
      }),
    );
  }

  ok(data) {
    return ResponseHandler.successResponse(data || 'Success');
  }

  fail(data) {
    return ResponseHandler.errorResponse(data || 'Failed');
  }
}
