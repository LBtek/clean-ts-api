import { type AccountModel } from '@/domain/models/account'
import { type AddAccountParams } from '@/domain/usecases/account/add-account'
import { type SurveyModel } from '@/domain/models/survey'
import { type SurveyVoteModel } from '@/domain/models/survey-vote'
import { type SaveSurveyVoteParams } from '@/domain/usecases/survey-vote/save-survey-vote'
import { type AddAccountRepository } from '../protocols/repositories/account/add-account-repository'
import { type AddSurveyRepositoryParams, type AddSurveyRepository } from '../protocols/repositories/survey/add-survey-repository'
import { type LoadSurveysRepository } from '../protocols/repositories/survey/load-surveys-repository'
import { type LoadSurveyByIdRepository } from '../protocols/repositories/survey/load-survey-by-id-repository'
import { type LoadAccountByEmailRepository } from '../protocols/repositories/account/load-account-by-email-repository'
import { type LoadAccountByTokenRepository } from '../protocols/repositories/account/load-account-by-token-repository'
import { type UpdateAccessTokenRepository } from '../protocols/repositories/account/update-access-token-repository'
import { type SaveSurveyVoteRepository } from '../protocols/repositories/survey-vote/save-survey-vote-repository'
import { type LogErrorRepository } from '../protocols/repositories/log/log-error-repository'
import { type UpdateSurveyRepository } from '../protocols/repositories/survey/update-survey-repository'
import { mockAccount, mockSurvey, mockSurveys } from '@/domain/models/mocks'

export class AddAccountRepositorySpy implements AddAccountRepository {
  addAccountData: AddAccountParams
  account = mockAccount()

  async add (accountData: AddAccountParams): Promise<AccountModel> {
    this.addAccountData = accountData
    return this.account
  }
}

export class AddSurveyRepositorySpy implements AddSurveyRepository {
  addSurveyData: AddSurveyRepositoryParams

  async add (surveyData: AddSurveyRepositoryParams): Promise<void> {
    this.addSurveyData = surveyData
  }
}

export class UpdateSurveyRepositorySpy implements UpdateSurveyRepository {
  oldSurvey: SurveyModel
  newSurvey: SurveyModel
  oldAnswer: string
  newAnswer: string

  async update (survey: SurveyModel, oldAnswer: string = null, newAnswer: string): Promise<SurveyModel> {
    this.oldAnswer = oldAnswer
    this.newAnswer = newAnswer
    this.oldSurvey = survey
    this.newSurvey = {
      ...survey,
      answers: survey.answers.map(a => {
        const answer = { ...a }
        if (oldAnswer && answer.answer === oldAnswer) {
          answer.amountVotes = answer.amountVotes - 1
        }
        if (answer.answer === newAnswer) {
          answer.amountVotes = answer.amountVotes + 1
        }
        return answer
      }),
      totalAmountVotes: oldAnswer ? survey.totalAmountVotes : survey.totalAmountVotes + 1
    }
    return this.newSurvey
  }
}

export class LoadSurveyByIdRepositorySpy implements LoadSurveyByIdRepository {
  survey = mockSurvey()
  id: string

  async loadById (id: string): Promise<SurveyModel> {
    this.id = id
    return this.survey
  }
}

export class LoadSurveysRepositorySpy implements LoadSurveysRepository {
  surveys = mockSurveys()

  async loadAll (): Promise<SurveyModel[]> {
    return this.surveys
  }
}

export class LoadAccountByEmailRepositorySpy implements LoadAccountByEmailRepository {
  account = mockAccount()
  email: string

  async loadByEmail (email: string): Promise<AccountModel | null> {
    this.email = email
    return this.account
  }
}

export class LoadAccountByTokenRepositorySpy implements LoadAccountByTokenRepository {
  token: string
  role: string
  account = mockAccount()

  async loadByToken (token: string, role?: string): Promise<AccountModel> {
    this.token = token
    this.role = role
    return this.account
  }
}

export class UpdateAccessTokenRepositorySpy implements UpdateAccessTokenRepository {
  id: string
  token: string

  async updateAccessToken (id: string, token: string): Promise<void> {
    this.id = id
    this.token = token
  }
}

export class SaveSurveyVoteRepositorySpy implements SaveSurveyVoteRepository {
  saveSurveyVoteData: SaveSurveyVoteParams
  oldSurveyVote = undefined

  async save (data: SaveSurveyVoteParams): Promise<SurveyVoteModel> {
    this.saveSurveyVoteData = data
    return this.oldSurveyVote
  }
}

export class LogErrorRepositorySpy implements LogErrorRepository {
  stack: string
  typeError: 'server' | 'auth'

  async logError (stack: string, typeError: 'server' | 'auth'): Promise<void> {
    this.stack = stack
    this.typeError = typeError
  }
}
