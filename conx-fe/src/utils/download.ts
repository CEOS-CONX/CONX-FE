// 교차 출처(S3 등) 파일을 "강제 저장"하기 위한 다운로드 프록시 URL.
// 브라우저는 교차 출처 링크에서 download 속성을 무시하므로, 같은 출처인 이 프록시가
// 서버에서 파일을 받아 Content-Disposition: attachment 로 내려줘 브라우저가 저장하도록 한다.
export function fileDownloadUrl(url: string, fileName: string): string {
  const params = new URLSearchParams({ url, name: fileName });
  return `/api/files/download?${params.toString()}`;
}
