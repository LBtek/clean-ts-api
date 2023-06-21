import { type SaveSurveyResultRepository, type SaveSurveyResult, type SaveSurveyResultModel, type SurveyResultModel } from './db-save-survey-result-protocolls'

export class DbSaveSurveyResult implements SaveSurveyResult {
  constructor (private readonly saveSurveyResultRepository: SaveSurveyResultRepository) { }

  async save (data: SaveSurveyResultModel): Promise<SurveyResultModel> {
    await this.saveSurveyResultRepository.save(data)
    return null
  }
}